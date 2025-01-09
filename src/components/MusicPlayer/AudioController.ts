export interface AudioControllerProps {
  onTimeUpdate: (time: string) => void
  onDurationChange: (duration: string) => void
  onTrackEnd: () => void
  onLoadingChange: (isLoading: boolean) => void
}

export class AudioController {
  private audioContext: AudioContext | null = null
  private sourceNode: AudioBufferSourceNode | null = null
  private audioBuffer: AudioBuffer | null = null
  private startTime: number | null = null
  private pausedAt: number = 0
  private requestAnimationFrameId: number | null = null
  private analyserLeft: AnalyserNode | null = null
  private analyserRight: AnalyserNode | null = null

  constructor(private props: AudioControllerProps) {}

  async init(url: string): Promise<void> {
    try {
      const AudioContextConstructor =
        window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContextConstructor()

      this.analyserLeft = this.audioContext.createAnalyser()
      this.analyserRight = this.audioContext.createAnalyser()
      this.analyserLeft.fftSize = 32
      this.analyserRight.fftSize = 32

      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const arrayBuffer = await response.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      this.props.onDurationChange(this.formatTime(this.audioBuffer.duration))
      this.props.onLoadingChange(false)
    } catch (error) {
      console.error('Error loading audio:', error)
      throw error
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  updatePosition(playing: boolean): void {
    if (
      !this.audioContext ||
      !playing ||
      this.startTime == null ||
      !this.audioBuffer
    ) {
      return
    }

    const elapsed = this.audioContext.currentTime - this.startTime
    const currentPosition = this.pausedAt + elapsed

    if (currentPosition >= this.audioBuffer.duration) {
      this.stop()
      this.props.onTimeUpdate(this.formatTime(this.audioBuffer.duration))
      this.props.onTrackEnd()
      return
    }

    this.props.onTimeUpdate(this.formatTime(currentPosition))

    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
    }
    this.requestAnimationFrameId = requestAnimationFrame(() =>
      this.updatePosition(playing)
    )
  }

  play(): void {
    if (
      !this.audioContext ||
      !this.audioBuffer ||
      this.pausedAt >= this.audioBuffer.duration
    ) {
      console.warn('Cannot play: missing resources or end of track')
      return
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch((error) => {
        console.error('Error resuming AudioContext:', error)
      })
    }

    const sourceNode = this.audioContext.createBufferSource()
    sourceNode.buffer = this.audioBuffer

    const splitter = this.audioContext.createChannelSplitter(2)
    sourceNode.connect(splitter)

    if (this.analyserLeft && this.analyserRight) {
      splitter.connect(this.analyserLeft, 0)
      splitter.connect(this.analyserRight, 1)
    } else {
      console.warn('Analyser nodes are not initialized.')
    }
    splitter.connect(this.audioContext.destination)

    try {
      sourceNode.start(0, this.pausedAt)
    } catch (error) {
      console.error('Error starting source node:', error)
      return
    }

    this.startTime = this.audioContext.currentTime
    this.sourceNode = sourceNode
  }

  pause(): void {
    if (!this.audioContext || !this.sourceNode || this.startTime == null) {
      console.warn('Cannot pause: missing resources')
      return
    }

    const elapsed = this.audioContext.currentTime - this.startTime
    this.pausedAt = this.pausedAt + elapsed

    try {
      this.sourceNode.stop()
      this.sourceNode.disconnect()
      this.sourceNode = null
    } catch (error) {
      console.warn('Error while stopping source node:', error)
    }

    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
    }
  }

  stop(): void {
    if (!this.audioContext) {
      console.warn('Cannot stop: AudioContext is missing')
      return
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.sourceNode = null
      } catch (error) {
        console.warn('Error stopping source node:', error)
      }
    }

    this.pausedAt = 0
    this.startTime = null

    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
    }
  }

  cleanup(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
      } catch (error) {
        console.warn('Error stopping source node:', error)
      }
    }

    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
    }

    if (this.audioContext) {
      this.audioContext.close().catch((error) => {
        console.warn('Error closing audio context:', error)
      })
    }
  }

  getAnalyserNodes() {
    return {
      left: this.analyserLeft,
      right: this.analyserRight
    }
  }
}

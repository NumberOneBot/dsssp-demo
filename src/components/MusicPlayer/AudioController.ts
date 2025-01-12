import { type BiQuadCoefficients } from 'dsssp'

export interface AudioControllerProps {
  onTimeUpdate: (time: string) => void
  onDurationChange: (duration: string) => void
  onTrackEnd: () => void
  onLoadingChange: (isLoading: boolean) => void
  onAnalyserReady?: (analyser: {
    left: AnalyserNode
    right: AnalyserNode
  }) => void
  filters: BiQuadCoefficients[]
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
  private splitter: ChannelSplitterNode | null = null
  private biquadFilters: IIRFilterNode[] = []
  private gainNode: GainNode | null = null

  constructor(private props: AudioControllerProps) {}

  async init(url: string): Promise<void> {
    try {
      this.props.onLoadingChange(true)

      if (!this.audioContext) {
        const AudioContextConstructor =
          window.AudioContext || (window as any).webkitAudioContext
        this.audioContext = new AudioContextConstructor()

        this.gainNode = this.audioContext.createGain()
        this.gainNode.gain.value = 1
        this.gainNode.connect(this.audioContext.destination)

        this.splitter = this.audioContext.createChannelSplitter(2)

        this.analyserLeft = this.audioContext.createAnalyser()
        this.analyserRight = this.audioContext.createAnalyser()

        this.splitter.connect(this.analyserLeft, 0)
        this.splitter.connect(this.analyserRight, 1)
        ;[this.analyserLeft, this.analyserRight].forEach((analyzer) => {
          analyzer.fftSize = 32
          // analyzer.maxDecibels = -2 // dB
          // analyzer.minDecibels = -48
          analyzer.smoothingTimeConstant = 0.4 // 0.8
        })

        if (this.props.onAnalyserReady) {
          this.props.onAnalyserReady({
            left: this.analyserLeft,
            right: this.analyserRight
          })
        }

        await this.createFilters()
      }

      await this.loadTrack(url)

      this.props.onLoadingChange(false)
    } catch (error) {
      console.error('Error initializing AudioController:', error)
      this.props.onLoadingChange(false)
      throw error
    }
  }

  private getCurrentTime(): number {
    if (!this.startTime || !this.audioContext) return this.pausedAt
    const elapsed = this.audioContext.currentTime - this.startTime
    return this.pausedAt + elapsed
  }

  private async fadeGainTo(
    value: number,
    duration: number = 0.05
  ): Promise<void> {
    if (!this.gainNode || !this.audioContext) return

    const currentTime = this.audioContext.currentTime
    this.gainNode.gain.linearRampToValueAtTime(value, currentTime + duration)

    return new Promise((resolve) => setTimeout(resolve, duration * 1000))
  }

  private async createFilters(): Promise<void> {
    if (!this.audioContext) return

    this.biquadFilters = []

    for (const filter of this.props.filters) {
      const { A0, A1, A2, B1, B2 } = filter
      const feedforward = [A0, A1, A2]
      const feedback = [1, B1, B2]

      try {
        const iirFilter = new IIRFilterNode(this.audioContext, {
          feedforward,
          feedback
        })

        if (!iirFilter) {
          console.error('Error creating IIR filter')
          continue
        }

        this.biquadFilters.push(iirFilter)
      } catch (error) {
        console.error('Error creating IIR filter:', error)
      }
    }
  }

  private connectAudioGraph(): void {
    if (
      !this.sourceNode ||
      !this.audioContext ||
      !this.gainNode ||
      !this.splitter
    )
      return

    this.sourceNode.disconnect()

    let currentNode: AudioNode = this.sourceNode

    if (this.biquadFilters.length > 0) {
      this.biquadFilters.forEach((filter, index) => {
        filter.disconnect()
        currentNode.connect(filter)
        currentNode = filter
      })
    }

    currentNode.connect(this.splitter)
    currentNode.connect(this.gainNode)
  }

  async updateFilters(newFilters: BiQuadCoefficients[]): Promise<void> {
    if (!this.audioContext) return

    this.props.filters = newFilters

    const wasPlaying = this.sourceNode !== null
    const currentTime = this.getCurrentTime()
    // Record the start time of filters reconnection
    const filtersStartTime = performance.now()

    if (wasPlaying) await this.pause()

    await this.createFilters()

    if (wasPlaying) {
      const filterEndTime = performance.now()
      const timeSpentSeconds = (filterEndTime - filtersStartTime) / 1000
      // Adjust the pausedAt to account for the time spent during filter update
      this.pausedAt = currentTime + timeSpentSeconds
      // Resume playback from the adjusted position
      await this.play()
    } else {
      if (this.sourceNode && this.splitter) {
        this.connectAudioGraph()
      }
    }
  }

  private async loadTrack(url: string): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext is not initialized.')
    }

    if (this.sourceNode) {
      try {
        await this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.sourceNode = null
      } catch (error) {
        console.warn('Error stopping existing source node:', error)
      }
    }

    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

    this.props.onDurationChange(this.formatTime(this.audioBuffer.duration))
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
    )
      return

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

  async play(): Promise<void> {
    if (
      !this.audioContext ||
      !this.audioBuffer ||
      this.pausedAt >= this.audioBuffer.duration
    )
      return

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.sourceNode = null
      } catch (error) {
        console.warn('Error stopping existing source node:', error)
      }
    }

    const sourceNode = this.audioContext.createBufferSource()
    sourceNode.buffer = this.audioBuffer
    this.sourceNode = sourceNode

    this.connectAudioGraph()

    try {
      sourceNode.start(0, this.pausedAt)
    } catch (error) {
      console.error('Error starting source node:', error)
      return
    }

    this.startTime = this.audioContext.currentTime
    this.updatePosition(true)

    await this.fadeGainTo(1, 0.3)
  }

  async pause(): Promise<void> {
    if (!this.audioContext || !this.sourceNode || this.startTime == null) return

    await this.fadeGainTo(0, 0.1)

    const elapsed = this.audioContext.currentTime - this.startTime
    this.pausedAt += elapsed

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
    if (!this.audioContext) return

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
        console.warn('Error stopping source node during cleanup:', error)
      }
    }

    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
    }

    if (this.audioContext) {
      this.audioContext.close().catch((error) => {
        console.warn('Error closing AudioContext during cleanup:', error)
      })
      this.audioContext = null
    }

    this.analyserLeft = null
    this.analyserRight = null
    this.splitter = null
    this.gainNode = null
  }
}

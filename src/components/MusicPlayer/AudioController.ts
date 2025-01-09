export interface AudioControllerProps {
  onTimeUpdate: (time: string) => void
  onDurationChange: (duration: string) => void
  onTrackEnd: () => void
  onLoadingChange: (isLoading: boolean) => void
  onAnalyserReady?: (analyser: {
    left: AnalyserNode
    right: AnalyserNode
  }) => void // New event
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

  constructor(private props: AudioControllerProps) {}

  /**
   * Initializes AudioContext, Splitter, and Analyser only once.
   * Loading a new track is done through the loadTrack method.
   * @param url URL of the audio file.
   */
  async init(url: string): Promise<void> {
    try {
      this.props.onLoadingChange(true)
      console.log('Initializing AudioController...')

      if (!this.audioContext) {
        const AudioContextConstructor =
          window.AudioContext || (window as any).webkitAudioContext
        this.audioContext = new AudioContextConstructor()
        console.log('AudioContext created.')

        // Create AnalyserNodes
        this.analyserLeft = this.audioContext.createAnalyser()
        this.analyserRight = this.audioContext.createAnalyser()
        this.analyserLeft.fftSize = 32
        this.analyserRight.fftSize = 32
        console.log('AnalyserNodes created.')

        // Create ChannelSplitterNode
        this.splitter = this.audioContext.createChannelSplitter(2)
        console.log('ChannelSplitterNode created.')

        // Connect analysers to splitter
        if (this.splitter && this.analyserLeft && this.analyserRight) {
          this.splitter.connect(this.analyserLeft, 0)
          this.splitter.connect(this.analyserRight, 1)
          console.log('AnalyserNodes connected to splitter.')

          // **Connect splitter to destination**
          this.splitter.connect(this.audioContext.destination)
          console.log('Splitter connected to AudioContext.destination.')

          // Emit analyser availability event
          if (this.props.onAnalyserReady) {
            this.props.onAnalyserReady({
              left: this.analyserLeft,
              right: this.analyserRight
            })
            console.log('onAnalyserReady event emitted.')
          }
        } else {
          console.warn('Failed to initialize AnalyserNodes or splitter.')
        }
      }

      // Load track
      await this.loadTrack(url)
      console.log('Track loaded.')

      this.props.onLoadingChange(false)
    } catch (error) {
      console.error('Error initializing AudioController:', error)
      this.props.onLoadingChange(false)
      throw error
    }
  }

  /**
   * Loads an audio file and decodes it.
   * @param url URL of the audio file.
   */
  private async loadTrack(url: string): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext is not initialized.')
    }

    // Stop and disconnect existing sourceNode if it exists
    if (this.sourceNode) {
      try {
        await this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.sourceNode = null
        console.log('Existing sourceNode stopped and disconnected.')
      } catch (error) {
        console.warn('Error stopping existing source node:', error)
      }
    }

    // Load audio
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    console.log('Audio data decoded.')

    // Update duration
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

    // Stop and disconnect previous sourceNode if it exists
    if (this.sourceNode) {
      try {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.sourceNode = null
        console.log('Existing sourceNode stopped and disconnected.')
      } catch (error) {
        console.warn('Error stopping existing source node:', error)
      }
    }

    const sourceNode = this.audioContext.createBufferSource()
    sourceNode.buffer = this.audioBuffer!
    this.sourceNode = sourceNode
    console.log('New sourceNode created.')

    // Connect sourceNode to splitter
    if (this.splitter) {
      sourceNode.connect(this.splitter)
      console.log('sourceNode connected to splitter.')
    } else {
      console.warn('ChannelSplitterNode is not initialized.')
      // As a fallback, connect directly to destination
      sourceNode.connect(this.audioContext.destination)
      console.log('sourceNode connected directly to destination.')
    }

    try {
      sourceNode.start(0, this.pausedAt)
      console.log('sourceNode started.')
    } catch (error) {
      console.error('Error starting source node:', error)
      return
    }

    this.startTime = this.audioContext.currentTime
    this.updatePosition(true)
  }

  pause(): void {
    if (!this.audioContext || !this.sourceNode || this.startTime == null) {
      console.warn('Cannot pause: missing resources')
      return
    }

    const elapsed = this.audioContext.currentTime - this.startTime
    this.pausedAt += elapsed

    try {
      this.sourceNode.stop()
      this.sourceNode.disconnect()
      this.sourceNode = null
      console.log('sourceNode stopped and disconnected.')
    } catch (error) {
      console.warn('Error while stopping source node:', error)
    }

    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
      console.log('Animation frame canceled.')
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
        console.log('sourceNode stopped and disconnected.')
      } catch (error) {
        console.warn('Error stopping source node:', error)
      }
    }

    this.pausedAt = 0
    this.startTime = null

    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
      console.log('Animation frame canceled.')
    }
  }

  cleanup(): void {
    // Stop and disconnect sourceNode
    if (this.sourceNode) {
      try {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
        console.log('sourceNode stopped and disconnected during cleanup.')
      } catch (error) {
        console.warn('Error stopping source node during cleanup:', error)
      }
    }

    // Cancel position animation
    if (this.requestAnimationFrameId != null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
      console.log('Animation frame canceled during cleanup.')
    }

    // Close AudioContext
    if (this.audioContext) {
      this.audioContext.close().catch((error) => {
        console.warn('Error closing AudioContext during cleanup:', error)
      })
      this.audioContext = null
      console.log('AudioContext closed during cleanup.')
    }

    // Clear analysers and splitter
    this.analyserLeft = null
    this.analyserRight = null
    this.splitter = null
    console.log('AnalyserNodes and splitter cleared during cleanup.')
  }

  getAnalyserNodes() {
    if (!this.analyserLeft || !this.analyserRight) {
      console.warn('Analyser nodes are not available.')
      return null
    }
    return {
      left: this.analyserLeft,
      right: this.analyserRight
    }
  }
}

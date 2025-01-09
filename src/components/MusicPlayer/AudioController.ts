export interface AudioControllerProps {
  onTimeUpdate: (time: string) => void
  onDurationChange: (duration: string) => void
  onTrackEnd: () => void
  onLoadingChange: (isLoading: boolean) => void
  onTrackChange?: () => void // New event for track changes
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
   * Initializes the loading of an audio file.
   * @param url URL of the audio file.
   */
  async init(url: string): Promise<void> {
    try {
      this.props.onLoadingChange(true)

      // Stop and disconnect the previous source if it exists
      if (this.sourceNode) {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.sourceNode = null
      }

      // If the context is not yet initialized, create it
      if (!this.audioContext) {
        const AudioContextConstructor =
          window.AudioContext || (window as any).webkitAudioContext
        this.audioContext = new AudioContextConstructor()

        // Create analyzers
        this.analyserLeft = this.audioContext.createAnalyser()
        this.analyserRight = this.audioContext.createAnalyser()
        this.analyserLeft.fftSize = 128 // Can be adjusted as needed
        this.analyserRight.fftSize = 128

        // Create a channel splitter and connect analyzers
        this.splitter = this.audioContext.createChannelSplitter(2)
        this.splitter.connect(this.analyserLeft, 0)
        this.splitter.connect(this.analyserRight, 1)

        // Connect analyzers to the destination (optional, remove if playback is not needed)
        this.analyserLeft.connect(this.audioContext.destination)
        this.analyserRight.connect(this.audioContext.destination)
      }

      // Load the audio file
      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const arrayBuffer = await response.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      // Update duration and states
      this.props.onDurationChange(this.formatTime(this.audioBuffer.duration))
      this.props.onLoadingChange(false)
      this.props.onTrackChange && this.props.onTrackChange() // Trigger track change event
      this.pausedAt = 0
      this.startTime = null
    } catch (error) {
      console.error('Error loading audio:', error)
      this.props.onLoadingChange(false)
      throw error
    }
  }

  /**
   * Formats time in M:SS format.
   * @param seconds Time in seconds.
   * @returns Formatted time string.
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  /**
   * Updates the current playback time.
   * @param playing Playback flag.
   */
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

  /**
   * Plays the audio file.
   */
  async play(): Promise<void> {
    if (!this.audioBuffer) {
      console.warn('Audio buffer not initialized. Call init(url) first.')
      return
    }

    if (this.pausedAt >= this.audioBuffer.duration) {
      console.warn(
        'Cannot play: paused position is at or beyond track duration.'
      )
      return
    }

    // Create AudioContext on the first play call if it's not already created
    if (!this.audioContext) {
      const AudioContextConstructor =
        window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContextConstructor()

      // Create analyzers
      this.analyserLeft = this.audioContext.createAnalyser()
      this.analyserRight = this.audioContext.createAnalyser()
      this.analyserLeft.fftSize = 128
      this.analyserRight.fftSize = 128

      // Create a channel splitter and connect analyzers
      this.splitter = this.audioContext.createChannelSplitter(2)
      this.splitter.connect(this.analyserLeft, 0)
      this.splitter.connect(this.analyserRight, 1)

      // Connect analyzers to the destination (optional, remove if playback is not needed)
      this.analyserLeft.connect(this.audioContext.destination)
      this.analyserRight.connect(this.audioContext.destination)
    }

    // Resume AudioContext if it was suspended
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch (error) {
        console.error('Error resuming AudioContext:', error)
        return
      }
    }

    // Stop and disconnect the previous source if it exists
    if (this.sourceNode) {
      this.sourceNode.stop()
      this.sourceNode.disconnect()
      this.sourceNode = null
    }

    // Create a new source
    const sourceNode = this.audioContext.createBufferSource()
    sourceNode.buffer = this.audioBuffer
    this.sourceNode = sourceNode

    // Create a channel splitter if it doesn't exist
    if (!this.splitter) {
      this.splitter = this.audioContext.createChannelSplitter(2)
      if (this.analyserLeft && this.analyserRight) {
        this.splitter.connect(this.analyserLeft, 0)
        this.splitter.connect(this.analyserRight, 1)
      }
      this.analyserLeft?.connect(this.audioContext.destination)
      this.analyserRight?.connect(this.audioContext.destination)
    }

    // Connect the source to the splitter
    sourceNode.connect(this.splitter)

    // Connect the splitter to the destination through analyzers
    if (this.analyserLeft && this.analyserRight) {
      this.splitter.connect(this.analyserLeft, 0)
      this.splitter.connect(this.analyserRight, 1)
    } else {
      console.warn('Analyser nodes are not initialized.')
    }
    this.splitter.connect(this.audioContext.destination)

    try {
      sourceNode.start(0, this.pausedAt)
    } catch (error) {
      console.error('Error starting source node:', error)
      return
    }

    this.startTime = this.audioContext.currentTime
    this.updatePosition(true)
  }

  /**
   * Pauses playback.
   */
  pause(): void {
    if (!this.audioContext || !this.sourceNode || this.startTime == null) {
      console.warn('Cannot pause: missing resources.')
      return
    }

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

  /**
   * Stops playback and resets the position.
   */
  stop(): void {
    if (!this.audioContext) {
      console.warn('Cannot stop: AudioContext is missing.')
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

  /**
   * Cleans up all resources.
   */
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
        console.warn('Error closing AudioContext:', error)
      })
      this.audioContext = null
    }

    this.analyserLeft = null
    this.analyserRight = null
    this.splitter = null
  }

  /**
   * Returns instances of the analyzers.
   * @returns Object containing left and right analyzers.
   */
  getAnalyserNodes() {
    return {
      left: this.analyserLeft,
      right: this.analyserRight
    }
  }
}

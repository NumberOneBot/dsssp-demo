export interface AudioControllerProps {
  audioContextRef: { current: AudioContext | null }
  sourceNodeRef: { current: AudioBufferSourceNode | null }
  audioBufferRef: { current: AudioBuffer | null }
  startTimeRef: { current: number | null }
  pausedAtRef: { current: number | null }
  requestAnimationFrameIdRef: { current: number | null }
}

export class AudioController {
  constructor(private props: AudioControllerProps) {}

  async init(
    url: string,
    onDurationChange: (duration: number) => void
  ): Promise<void> {
    try {
      const audioContext = new AudioContext()
      this.props.audioContextRef.current = audioContext

      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      this.props.audioBufferRef.current = audioBuffer

      onDurationChange(audioBuffer.duration)
    } catch (error) {
      console.error('Error loading audio:', error)
      throw error
    }
  }

  updatePosition(
    playing: boolean,
    onTimeUpdate: (currentTime: number) => void
  ): void {
    if (!this.props.audioContextRef.current || !playing) return

    const elapsed =
      this.props.audioContextRef.current.currentTime -
      (this.props.startTimeRef.current || 0)
    const currentPosition = (this.props.pausedAtRef.current || 0) + elapsed

    onTimeUpdate(currentPosition)

    this.props.requestAnimationFrameIdRef.current = requestAnimationFrame(() =>
      this.updatePosition(playing, onTimeUpdate)
    )
  }

  play(): void {
    const audioContext = this.props.audioContextRef.current
    const audioBuffer = this.props.audioBufferRef.current

    if (!audioContext || !audioBuffer) return

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.connect(audioContext.destination)

    sourceNode.start(0, this.props.pausedAtRef.current || 0)
    this.props.startTimeRef.current = audioContext.currentTime
    this.props.sourceNodeRef.current = sourceNode
  }

  pause(): void {
    if (
      !this.props.audioContextRef.current ||
      !this.props.sourceNodeRef.current
    )
      return

    const elapsed =
      this.props.audioContextRef.current.currentTime -
      (this.props.startTimeRef.current || 0)
    this.props.pausedAtRef.current =
      (this.props.pausedAtRef.current || 0) + elapsed

    try {
      this.props.sourceNodeRef.current.stop()
    } catch (error) {
      console.warn('Attempted to stop an already stopped source node:', error)
    }
    this.props.sourceNodeRef.current.disconnect()
    this.props.sourceNodeRef.current = null
  }

  cleanup(): void {
    if (this.props.sourceNodeRef.current) {
      try {
        this.props.sourceNodeRef.current.stop()
      } catch (error) {
        console.warn('Attempted to stop an already stopped source node:', error)
      }
      this.props.sourceNodeRef.current.disconnect()
      this.props.sourceNodeRef.current = null
    }

    if (this.props.requestAnimationFrameIdRef.current) {
      cancelAnimationFrame(this.props.requestAnimationFrameIdRef.current)
    }

    this.props.audioContextRef.current?.close()
  }
}

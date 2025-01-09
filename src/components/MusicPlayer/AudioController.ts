import { MutableRefObject } from 'react'

export interface AudioControllerProps {
  audioContextRef: MutableRefObject<AudioContext | null>
  sourceNodeRef: MutableRefObject<AudioBufferSourceNode | null>
  audioBufferRef: MutableRefObject<AudioBuffer | null>
  startTimeRef: MutableRefObject<number | null>
  pausedAtRef: MutableRefObject<number | null>
  requestAnimationFrameIdRef: MutableRefObject<number | null>
  analyserLeftRef: MutableRefObject<AnalyserNode | null>
  analyserRightRef: MutableRefObject<AnalyserNode | null>
}

export class AudioController {
  constructor(private props: AudioControllerProps) {}

  async init(
    url: string,
    onDurationChange: (duration: number) => void
  ): Promise<void> {
    try {
      const AudioContextConstructor =
        window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContextConstructor()
      this.props.audioContextRef.current = audioContext

      const analyserLeft = audioContext.createAnalyser()
      const analyserRight = audioContext.createAnalyser()
      analyserLeft.fftSize = 256
      analyserRight.fftSize = 256
      this.props.analyserLeftRef.current = analyserLeft
      this.props.analyserRightRef.current = analyserRight

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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
    const audioContext = this.props.audioContextRef.current
    const startTime = this.props.startTimeRef.current
    const pausedAt = this.props.pausedAtRef.current
    const audioBuffer = this.props.audioBufferRef.current

    if (
      !audioContext ||
      !playing ||
      startTime == null ||
      pausedAt == null ||
      !audioBuffer
    ) {
      return
    }

    const elapsed = audioContext.currentTime - startTime
    const currentPosition = pausedAt + elapsed

    if (currentPosition >= audioBuffer.duration) {
      this.stop()
      onTimeUpdate(audioBuffer.duration)
      return
    }

    onTimeUpdate(currentPosition)

    if (this.props.requestAnimationFrameIdRef.current != null) {
      cancelAnimationFrame(this.props.requestAnimationFrameIdRef.current)
    }
    this.props.requestAnimationFrameIdRef.current = requestAnimationFrame(() =>
      this.updatePosition(playing, onTimeUpdate)
    )
  }

  play(): void {
    const audioContext = this.props.audioContextRef.current
    const audioBuffer = this.props.audioBufferRef.current
    const pausedAt = this.props.pausedAtRef.current

    if (
      !audioContext ||
      !audioBuffer ||
      pausedAt == null ||
      pausedAt >= audioBuffer.duration
    ) {
      console.warn('Cannot play: missing resources or end of track')
      return
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch((error) => {
        console.error('Error resuming AudioContext:', error)
      })
    }

    const sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer

    const splitter = audioContext.createChannelSplitter(2)
    sourceNode.connect(splitter)

    if (
      this.props.analyserLeftRef.current &&
      this.props.analyserRightRef.current
    ) {
      splitter.connect(this.props.analyserLeftRef.current, 0)
      splitter.connect(this.props.analyserRightRef.current, 1)
    } else {
      console.warn('Analyser nodes are not initialized.')
    }
    splitter.connect(audioContext.destination)

    try {
      // Запускаем с учетом сохраненной позиции pausedAt
      sourceNode.start(0, pausedAt)
    } catch (error) {
      console.error('Error starting source node:', error)
      return
    }

    // Устанавливаем startTime, равным текущему времени, для точного расчета elapsed
    this.props.startTimeRef.current = audioContext.currentTime

    this.props.sourceNodeRef.current = sourceNode

    sourceNode.onended = () => {
      // ...existing onended logic (optional)...
    }
  }

  pause(): void {
    const audioContext = this.props.audioContextRef.current
    const sourceNode = this.props.sourceNodeRef.current
    const startTime = this.props.startTimeRef.current
    const pausedAt = this.props.pausedAtRef.current

    if (!audioContext || !sourceNode || startTime == null || pausedAt == null) {
      console.warn('Cannot pause: missing resources')
      return
    }

    const elapsed = audioContext.currentTime - startTime
    this.props.pausedAtRef.current = pausedAt + elapsed

    try {
      sourceNode.stop()
      sourceNode.disconnect()
      this.props.sourceNodeRef.current = null
    } catch (error) {
      console.warn('Error while stopping source node:', error)
    }

    if (this.props.requestAnimationFrameIdRef.current != null) {
      cancelAnimationFrame(this.props.requestAnimationFrameIdRef.current)
      this.props.requestAnimationFrameIdRef.current = null
    }
  }
  stop(): void {
    const audioContext = this.props.audioContextRef.current
    const sourceNode = this.props.sourceNodeRef.current

    if (!audioContext) {
      console.warn('Cannot stop: AudioContext is missing')
      return
    }

    if (sourceNode) {
      try {
        sourceNode.stop()
        sourceNode.disconnect()
        this.props.sourceNodeRef.current = null
      } catch (error) {
        console.warn('Error stopping source node:', error)
      }
    }

    // Reset position to beginning
    this.props.pausedAtRef.current = 0
    this.props.startTimeRef.current = null

    // Cancel any ongoing animation frame
    if (this.props.requestAnimationFrameIdRef.current != null) {
      cancelAnimationFrame(this.props.requestAnimationFrameIdRef.current)
      this.props.requestAnimationFrameIdRef.current = null
    }
  }

  cleanup(): void {
    const sourceNode = this.props.sourceNodeRef.current
    const audioContext = this.props.audioContextRef.current
    const requestAnimationFrameId =
      this.props.requestAnimationFrameIdRef.current

    if (sourceNode) {
      try {
        sourceNode.stop()
        sourceNode.disconnect()
      } catch (error) {
        console.warn('Error stopping source node:', error)
      }
      this.props.sourceNodeRef.current = null
    }

    if (requestAnimationFrameId != null) {
      cancelAnimationFrame(requestAnimationFrameId)
      this.props.requestAnimationFrameIdRef.current = null
    }

    if (audioContext) {
      audioContext.close().catch((error) => {
        console.warn('Error closing audio context:', error)
      })
      this.props.audioContextRef.current = null
    }
  }
}

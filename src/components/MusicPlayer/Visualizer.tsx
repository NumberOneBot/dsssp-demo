import React, { useRef, useEffect } from 'react'

interface VisualizerProps {
  analyser: AnalyserNode | null
  width?: number
  height?: number
}

export const Visualizer: React.FC<VisualizerProps> = ({
  analyser,
  width = 200,
  height = 20
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const frameInterval = 1000 / 30 // 30 FPS

  useEffect(() => {
    if (!analyser) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    analyser.fftSize = 32
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const totalSegments = 16
    const segmentWidth = width / totalSegments

    const getSegmentColor = (
      index: number,
      total: number,
      lastActive: boolean
    ) => {
      const colorChangeStartIndex = (2 * total) / 3 // Start from last third
      const startHue = 100 // Green
      let hue: number

      if (index < colorChangeStartIndex) {
        hue = startHue
      } else {
        const fraction =
          (index - colorChangeStartIndex) / (total - colorChangeStartIndex)
        hue = startHue - fraction * 120 // Transition to red
      }

      const lightness = lastActive ? 50 : 25
      return `hsl(${hue}, 100%, ${lightness}%)`
    }

    const draw = (timestamp: number) => {
      if (timestamp - lastFrameTimeRef.current < frameInterval) {
        requestAnimationFrame(draw)
        return
      }
      lastFrameTimeRef.current = timestamp

      analyser.getByteFrequencyData(dataArray)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)

      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const avgAmplitude = sum / bufferLength
      const ratio = avgAmplitude / 255
      const activeSegments = Math.floor(ratio * totalSegments)

      for (let i = 0; i < totalSegments; i++) {
        if (i < activeSegments) {
          const lastActive = i === activeSegments - 1
          ctx.fillStyle = getSegmentColor(i, totalSegments, lastActive)
        } else {
          ctx.fillStyle = '#222222'
        }
        const x = i * segmentWidth
        ctx.fillRect(x, 0, segmentWidth - 1, height)
      }

      requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)

    return () => {
      // Cleanup if necessary
    }
  }, [analyser, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
    />
  )
}

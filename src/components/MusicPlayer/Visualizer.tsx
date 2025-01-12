import React, { useRef, useEffect } from 'react'

interface VisualizerProps {
  analyser: AnalyserNode | null
  width?: number
  height?: number
  maxFPS?: number // Optional prop for maximum frame rate
  amplitude?: 'average' | 'max'
}

export const Visualizer: React.FC<VisualizerProps> = ({
  analyser,
  width = 200,
  height = 20,
  amplitude = 'average',
  maxFPS
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const frameInterval = maxFPS ? 1000 / maxFPS : 0 // Calculate frame interval if maxFPS is set

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
      const colorChangeStartIndex = (1 * total) / 3 // the first 2/3 remain green
      const startHue = 100 // warm green
      let hue: number

      if (index < colorChangeStartIndex) {
        hue = startHue
      } else {
        const fraction =
          (index - colorChangeStartIndex) / (total - colorChangeStartIndex)
        hue = startHue - fraction * 120
      }

      const lightness = lastActive ? 50 : 30
      return `hsl(${hue}, 100%, ${lightness}%)`
    }

    const draw = (timestamp: number) => {
      if (maxFPS) {
        if (timestamp - lastFrameTimeRef.current < frameInterval) {
          requestAnimationFrame(draw)
          return
        }
        lastFrameTimeRef.current = timestamp
      }

      analyser.getByteFrequencyData(dataArray)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)

      let ratio: number
      if (amplitude === 'max') {
        // Find maximum amplitude
        const maxAmplitude = Math.max(...Array.from(dataArray))
        ratio = maxAmplitude / 255 // 0..1
      } else {
        // Calculate average amplitude
        const sum = dataArray.reduce((a, b) => a + b, 0)
        const avgAmplitude = sum / bufferLength
        ratio = avgAmplitude / 255 // 0..1
      }

      const activeSegments = Math.floor(ratio * totalSegments)

      // Rest of drawing logic remains the same
      for (let i = 0; i < totalSegments; i++) {
        if (i < activeSegments) {
          const lastActive = i === activeSegments - 1
          ctx.fillStyle = getSegmentColor(i, totalSegments, lastActive)
        } else {
          ctx.fillStyle = '#222222'
        }
        const x = i * segmentWidth
        ctx.fillRect(x, 0, segmentWidth - 1, height) // -1 for a small gap
      }

      requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)

    return () => {
      // Cleanup if necessary
    }
  }, [analyser, width, height, maxFPS, frameInterval])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
    />
  )
}

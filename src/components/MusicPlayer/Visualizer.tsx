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

  useEffect(() => {
    if (!analyser) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // You can use a minimum fftSize of 32
    analyser.fftSize = 32
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const totalSegments = 16
    const segmentWidth = width / totalSegments

    // Segment color determining function (customizable)
    const getSegmentColor = (
      index: number,
      total: number,
      lastActive: boolean
    ) => {
      // Start changing color only from the last third
      const colorChangeStartIndex = (1 * total) / 3 // the first 2/3 remain green
      const startHue = 100 // warm green
      let hue: number

      if (index < colorChangeStartIndex) {
        // Keep it green until colorChangeStartIndex
        hue = startHue
      } else {
        // After colorChangeStartIndex, gradually transition to red
        const fraction =
          (index - colorChangeStartIndex) / (total - colorChangeStartIndex)
        hue = startHue - fraction * 120
      }

      // Keep the lightness parameter as in your logic
      const lightness = lastActive ? 50 : 30
      return `hsl(${hue}, 100%, ${lightness}%)`
    }

    const draw = () => {
      analyser.getByteFrequencyData(dataArray)
      // Clear the canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)

      // Calculate average amplitude
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const avgAmplitude = sum / bufferLength
      const ratio = avgAmplitude / 255 // 0..1
      // How many segments should be "activated"
      const activeSegments = Math.floor(ratio * totalSegments)

      // Draw each segment if it is "active"
      for (let i = 0; i < totalSegments; i++) {
        // If the current volume covers this segment, fill it
        if (i < activeSegments) {
          const lastActive = i === activeSegments - 1
          ctx.fillStyle = getSegmentColor(i, totalSegments, lastActive)
        } else {
          // Otherwise make the segment inactive (for example, dark green / gray)
          ctx.fillStyle = '#222222'
        }
        const x = i * segmentWidth
        ctx.fillRect(x, 0, segmentWidth - 1, height) // -1 for a small gap
      }

      requestAnimationFrame(draw)
    }
    draw()
  }, [analyser, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
    />
  )
}

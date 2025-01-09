import React, { useRef, useEffect } from 'react'

interface VisualizerProps {
  analyser: AnalyserNode | null
  width?: number
  height?: number
}

export const Visualizer: React.FC<VisualizerProps> = ({
  analyser,
  width = 200,
  height = 100
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!analyser) return

    const canvas = canvasRef.current
    const canvasCtx = canvas?.getContext('2d')
    if (!canvasCtx) return

    analyser.fftSize = 64
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!canvasCtx) return

      analyser.getByteFrequencyData(dataArray)

      // Clear the canvas with a solid background color
      canvasCtx.fillStyle = 'rgb(0, 0, 0)' // Black background
      canvasCtx.fillRect(0, 0, width, height)

      const barWidth = Math.floor(width / bufferLength)
      let posX = 0

      for (let i = 0; i < bufferLength; i++) {
        // Scale the bar height based on the canvas height
        const barHeight = Math.round((dataArray[i] / 255) * height)

        // Choose a brighter color for better visibility
        const red = Math.min(dataArray[i] + 50, 255) // Ensure the value doesn't exceed 255
        canvasCtx.fillStyle = `rgb(50, ${red},50)`
        canvasCtx.fillRect(
          posX,
          height - barHeight,
          Math.floor(barWidth - 1),
          barHeight
        ) // Reduce bar width by 1 to add space

        posX += barWidth
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

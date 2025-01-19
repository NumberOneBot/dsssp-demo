export const generateNoise = (
  width: number = 200,
  height: number = 200,
  opacity: number = 0.05
): string => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const imageData = ctx.createImageData(width, height)
    const buffer32 = new Uint32Array(imageData.data.buffer)
    const alpha = Math.round(opacity * 255)

    for (let i = 0; i < buffer32.length; i++) {
      // eslint-disable-next-line no-bitwise
      const color = (Math.random() * 255) | 0
      // eslint-disable-next-line no-bitwise
      buffer32[i] = (alpha << 24) | (color << 16) | (color << 8) | color
    }
    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL()
  }
  return ''
}

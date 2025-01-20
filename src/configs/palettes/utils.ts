import { type GraphThemeFilterColors } from 'dsssp'
import tailwindColors from 'tailwindcss/colors'

export type TailwindColorKey = keyof typeof tailwindColors

export const generateTailwindPalette = (
  colorKeys: TailwindColorKey[]
): GraphThemeFilterColors[] =>
  colorKeys.map((key) => {
    const currentColor = tailwindColors[key]
    return {
      point: currentColor[400],
      active: currentColor[300],

      curve: currentColor[500],

      gradient: currentColor[600],
      background: currentColor[600]
    }
  })

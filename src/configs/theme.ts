import { type GraphThemeOverride } from 'dsssp'
import tailwindColors from 'tailwindcss/colors'

import filterColors from './colors'

const theme: GraphThemeOverride = {
  background: {
    grid: {
      lineColor: tailwindColors.zinc[800],
      lineWidth: { center: 1, border: 1 }
    },
    gradient: { start: tailwindColors.zinc[900] },
    label: { color: tailwindColors.zinc[500] },
    tracker: {
      labelColor: tailwindColors.white,
      lineColor: tailwindColors.zinc[400]
    }
  },
  filters: {
    gradientOpacity: 0.75,
    zeroPoint: {
      color: tailwindColors.slate[400],
      background: tailwindColors.slate[500]
    },
    point: {
      label: { color: tailwindColors.white },
      backgroundOpacity: { drag: 1 }
    },
    curve: { width: { active: 1 }, opacity: { normal: 0.75, active: 1 } },
    colors: filterColors
  }
}

export default theme

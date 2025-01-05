import { type GraphThemeOverride } from 'dsssp'
import colors from 'tailwindcss/colors'

import filterColors from './colors'

const theme: GraphThemeOverride = {
  background: {
    grid: {
      lineColor: colors.zinc[800],
      lineWidth: { center: 1, border: 1 }
    },
    gradient: { start: colors.zinc[900] },
    label: { color: colors.zinc[500] },
    tracker: { labelColor: colors.white, lineColor: colors.zinc[400] }
  },
  filters: {
    point: { label: { color: 'white' }, backgroundOpacity: { drag: 1 } },
    curve: { width: { active: 1 }, opacity: { normal: 0.5, active: 1 } },
    colors: filterColors
  }
}

export default theme

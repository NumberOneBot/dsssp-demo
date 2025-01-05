import { FrequencyResponseGraph, CompositeCurve, FilterCurve } from 'dsssp'
import { type GraphFilter } from 'dsssp'

const filters: GraphFilter[] = [
  { freq: 400, gain: 6, q: 1, type: 'PEAK' },
  { freq: 600, gain: -8, q: 3, type: 'PEAK' },
  { freq: 1200, gain: 2, q: 0.7, type: 'HIGHSHELF2' }
]

const App = () => {
  return (
    <FrequencyResponseGraph
      width={800}
      height={480}
    >
      <FilterCurve
        filter={filters[0]}
        color="#FF9966"
      />
      <FilterCurve
        filter={filters[1]}
        color="#6699FF"
      />
      <FilterCurve
        filter={filters[2]}
        color="#66FF66"
      />
      <CompositeCurve filters={filters} />
    </FrequencyResponseGraph>
  )
}

export default App

import {
  FrequencyResponseGraph,
  CompositeCurve,
  FilterGradient,
  FilterPoint,
  type FilterChangeEvent,
  type GraphFilter,
  type GraphThemeOverride
} from 'dsssp'
import { useState } from 'react'

import NavBar from './components/NavBar'

const preset: GraphFilter[] = [
  { freq: 26, gain: -4, q: 0.7, type: 'PEAK' },
  { freq: 60, gain: 3, q: 0.7, type: 'PEAK' },
  { freq: 350, gain: -3.5, q: 0.7, type: 'PEAK' },
  { freq: 750, gain: 5.5, q: 0.7, type: 'PEAK' },
  { freq: 2400, gain: -7, q: 0.7, type: 'PEAK' }
]

const graphTheme: GraphThemeOverride = {
  background: {
    grid: {
      dotted: true,
      lineColor: '#47464b',
      lineWidth: { border: 0 }
    },
    gradient: {
      start: '#1d242d',
      stop: '#080c12'
    },
    label: { color: '#61646e', fontSize: 8 }
  }
}

const graphScale = {
  minGain: -12,
  maxGain: 12,
  minFreq: 20,
  maxFreq: 20000,
  dbSteps: 4,
  octaveTicks: 6,
  octaveLabels: [100, 1000, 10000]
}

const Demo2 = () => {
  const [filters, setFilters] = useState(preset)

  const handleFilterChange = (filterEvent: FilterChangeEvent) => {
    const { index, ...filter } = filterEvent

    setFilters((prevFilters) => {
      const newFilters = [...prevFilters]
      newFilters[index] = { ...newFilters[index], ...filter }
      return newFilters
    })
  }

  const glowFilter = {
    filter: `
      drop-shadow(0 0 1px #b7cbe7)
      drop-shadow(0 0 3px #b7cbe7)
    `
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#2b2f37] text-white">
      <div className="w-[408px] flex flex-col gap-4 p-2 pt-8">
        <div className="border-2 border-black overflow-hidden rounded-xl shadow-[0_10px_20px_10px_#0002,0_1px_2px_1px_#FFF2]">
          <FrequencyResponseGraph
            width={400}
            height={200}
            scale={graphScale}
            theme={graphTheme}
          >
            <FilterGradient
              fill
              opacity={0.1}
              color="#71abe0"
              id="composite-curve"
            />
            <CompositeCurve
              color="#71abe0"
              filters={filters}
              gradientId="composite-curve"
            />
            <CompositeCurve
              color="#71abe0"
              filters={filters}
              style={glowFilter}
            />
            {filters.map((filter, index) => (
              <FilterPoint
                key={index}
                index={index}
                filter={filter}
                radius={3}
                color="#b3ddf3"
                dragColor="#ffffff"
                activeColor="#ffffff"
                background="#b3ddf3"
                dragBackground="#ffffff"
                activeBackground="#ffffff"
                backgroundOpacity={1}
                dragBackgroundOpacity={1}
                activeBackgroundOpacity={1}
                onChange={handleFilterChange}
              />
            ))}
          </FrequencyResponseGraph>
        </div>

        <h1 className="text-2xl font-bold mt-4">Demo 2</h1>
        <NavBar />
      </div>
    </div>
  )
}

export default Demo2

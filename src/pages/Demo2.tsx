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
  { freq: 16, gain: -4, q: 0.7, type: 'PEAK' },
  { freq: 40, gain: 3, q: 0.7, type: 'PEAK' },
  { freq: 350, gain: -3.5, q: 0.7, type: 'PEAK' },
  { freq: 750, gain: 5.5, q: 0.7, type: 'PEAK' },
  { freq: 4400, gain: 2, q: 0.7, type: 'PEAK' }
]

const graphTheme: GraphThemeOverride = {
  background: {
    grid: {
      dotted: true,
      lineColor: '#8a8d90',
      lineWidth: { center: 1, border: 0 }
    },
    gradient: {
      start: '#0b0e0f',
      stop: '#090a0b'
    },
    label: { color: '#8a8d90', fontSize: 8 }
  }
}

const graphScale = {
  minGain: -12,
  maxGain: 12,
  minFreq: 10,
  maxFreq: 20000,
  dbSteps: 12,
  octaveTicks: 0,
  octaveLabels: [10, 100, 1000, 5000]
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
      drop-shadow(0 0 2px #b7cbe7)
    `
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="w-[408px] flex flex-col gap-4 p-1">
        <FrequencyResponseGraph
          width={400}
          height={200}
          scale={graphScale}
          theme={graphTheme}
        >
          <FilterGradient
            fill
            opacity={0.1}
            color="#b7cbe7"
            id="composite-curve"
          />
          <CompositeCurve
            color="#b7cbe7"
            filters={filters}
            gradientId="composite-curve"
          />
          <CompositeCurve
            color="#b7cbe7"
            filters={filters}
            style={glowFilter}
          />
          {filters.map((filter, index) => (
            <FilterPoint
              key={index}
              index={index}
              filter={filter}
              radius={3}
              color="#dadcde"
              dragColor="#ffffff"
              activeColor="#ffffff"
              background="#dadcde"
              dragBackground="#ffffff"
              activeBackground="#ffffff"
              backgroundOpacity={1}
              dragBackgroundOpacity={1}
              activeBackgroundOpacity={1}
              onChange={handleFilterChange}
            />
          ))}
        </FrequencyResponseGraph>
        <h1 className="text-2xl font-bold mt">Demo 2</h1>
        <NavBar />
      </div>
    </div>
  )
}

export default Demo2

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
  { freq: 20, gain: -4, q: 0.7, type: 'PEAK' },
  { freq: 100, gain: 3, q: 0.7, type: 'PEAK' },
  { freq: 250, gain: -4, q: 0.7, type: 'PEAK' },
  { freq: 1000, gain: 6, q: 0.7, type: 'PEAK' },
  { freq: 5000, gain: -3, q: 0.7, type: 'PEAK' }
]

const graphTheme: GraphThemeOverride = {
  background: {
    grid: {
      dotted: true,
      lineColor: '#414141',
      lineWidth: { center: 1, border: 0 }
    },
    gradient: {
      start: '#132632',
      stop: '#090909'
    },
    label: { color: '#8a8d90' }
  }
}

const graphScale = {
  minGain: -12,
  maxGain: 12,
  minFreq: 10,
  dbSteps: 12,
  octaveTicks: 0,
  octaveLabels: [10, 125, 1000, 5000]
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
  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="w-[600px] flex flex-col gap-4">
        <FrequencyResponseGraph
          width={600}
          height={300}
          scale={graphScale}
          theme={graphTheme}
        >
          <FilterGradient
            id="composite-curve"
            color="#b7cbe7"
            opacity={0.25}
            fill
          />
          <CompositeCurve
            filters={filters}
            color="#b7cbe7"
            gradientId="composite-curve"
          />
          {filters.map((filter, index) => (
            <FilterPoint
              key={index}
              index={index}
              filter={filter}
              radius={5}
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

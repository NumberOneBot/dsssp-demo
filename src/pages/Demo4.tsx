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
  { freq: 80, gain: 0, q: 0.7, type: 'HIGHPASS1' },
  { freq: 40, gain: 3.5, q: 0.7, type: 'PEAK' },
  { freq: 300, gain: -4, q: 0.7, type: 'PEAK' },
  { freq: 1000, gain: 6, q: 0.7, type: 'PEAK' },
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
      start: '#080c10',
      stop: '#233546',
      direction: 'DIAGONAL_BL_TR'
    },
    label: {
      color: '#959da9',
      fontSize: 10,
      fontFamily: 'Poppins,sans-serif'
    }
  }
}

const graphScale = {
  minGain: -12,
  maxGain: 12,
  minFreq: 20,
  maxFreq: 20000,
  dbSteps: 4,
  octaveTicks: 6,
  octaveLabels: [20, 100, 1000, 10000]
}

const Demo3 = () => {
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
      <div className="mt-8 border-[2.5px] border-black relative overflow-hidden rounded-xl shadow-[0_8px_16px_8px_#0002,0_1px_3px_1px_#FFF3]">
        <FrequencyResponseGraph
          width={460}
          height={220}
          scale={graphScale}
          theme={graphTheme}
        >
          <FilterGradient
            fill
            opacity={0.2}
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
              radius={4}
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
        <div className="absolute pointer-events-none top-0 right-0 p-1 px-3 text-[#ffffff] text-lg font-[poppins,sans-serif] font-semibold text-italic">
          Analyzer
        </div>
      </div>

      <NavBar />
    </div>
  )
}

export default Demo3

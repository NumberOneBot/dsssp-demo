import {
  CompositeCurve,
  type FilterChangeEvent,
  FilterCurve,
  FilterGradient,
  FilterPoint,
  FrequencyResponseGraph,
  type GraphScaleOverride,
  type GraphThemeOverride
} from 'dsssp'
import { useState } from 'react'

import { harmanPreset } from '../configs/presets'

import NavBar from './components/NavBar'

const colors = [
  '#fdb219',
  '#f3782b',
  '#ec5327',
  '#d53264',
  '#9f6e78',
  '#5b8885',
  '#2aa2a3'
]

const graphTheme: GraphThemeOverride = {
  background: {
    grid: {
      dotted: true,
      lineColor: '#3d4488',
      lineWidth: { minor: 0.5, major: 0.5, center: 0.5, border: 0 }
    },
    gradient: {
      stop: '#35184b',
      start: '#08080e',
      direction: 'HORIZONTAL'
    },
    label: {
      color: '#3d4488',
      fontSize: 10,
      fontFamily: 'Poppins,sans-serif'
    }
  },
  curve: {
    width: 2,
    color: '#b29aff'
  },
  filters: {
    gradientOpacity: 0.6,
    curve: {
      opacity: { normal: 0.1, active: 1 }
    },
    point: {
      radius: 12,
      backgroundOpacity: {
        normal: 1,
        active: 1,
        drag: 1
      },
      label: {
        fontSize: 18,
        fontFamily: 'Poppins,sans-serif',
        color: '#ffffff'
      }
    },
    colors: colors.map((c) => ({
      point: c,
      curve: c,
      gradient: c
    }))
  }
}

const graphScale: GraphScaleOverride = {
  minGain: -20,
  maxGain: 20,
  dbSteps: 4,
  octaveTicks: 6,
  octaveLabels: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000]
}

const Demo2 = () => {
  const [filters, setFilters] = useState(harmanPreset)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const handleMouseLeave = () => {
    setActiveIndex(-1)
  }

  const handleMouseEnter = ({ index }: { index: number }) => {
    setActiveIndex(index)
  }

  const handleFilterChange = (filterEvent: FilterChangeEvent) => {
    const { index, ...filter } = filterEvent

    setFilters((prevFilters) => {
      const newFilters = [...prevFilters]
      newFilters[index] = { ...newFilters[index], ...filter }
      return newFilters
    })
  }

  const getLabel = (index: number) => {
    return String.fromCharCode(65 + index)
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="w-[840px] flex flex-col pt-8">
        <div className="overflow-hidden rounded-xl relative">
          <FrequencyResponseGraph
            width={840}
            height={480}
            theme={graphTheme}
            scale={graphScale}
          >
            {filters.map((filter, index) => (
              <>
                <FilterGradient
                  key={index}
                  index={index}
                  filter={filter}
                  id={`filter-${index}`}
                />

                <FilterCurve
                  showPin
                  key={index}
                  index={index}
                  filter={filter}
                  active={activeIndex === index}
                  gradientId={`filter-${index}`}
                />
              </>
            ))}
            <CompositeCurve filters={filters} />
            {filters.map((filter, index) => (
              <FilterPoint
                key={index}
                index={index}
                filter={filter}
                label={getLabel(index)}
                active={activeIndex === index}
                onEnter={handleMouseEnter}
                onLeave={handleMouseLeave}
                onChange={handleFilterChange}
              />
            ))}
          </FrequencyResponseGraph>
          <div className="absolute pointer-events-none top-0 right-0 p-2 px-4 text-[#b29aff] text-xl font-[poppins,sans-serif] font-semibold text-italic">
            Harman Curve
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Demo2

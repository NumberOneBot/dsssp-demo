import {
  CompositeCurve,
  type FilterChangeEvent,
  FilterCurve,
  FilterGradient,
  FilterPoint,
  FrequencyResponseGraph,
  type GraphScaleOverride,
  type GraphThemeOverride,
  PointerTracker
} from 'dsssp'
import { useState } from 'react'

import { customPreset } from '../configs/presets'

import NavBar from './components/NavBar'

const colors = [
  '#66c9cc',
  '#66cc6b',
  '#b6cc66',
  '#ccca66',
  '#ccac66',
  '#cc7766',
  '#cc668b'
]

const graphTheme: GraphThemeOverride = {
  background: {
    grid: {
      lineColor: '#c1bfbe',
      lineWidth: { minor: 0.5, major: 1, center: 0, border: 1 }
    },
    gradient: {
      start: '#e9e5e1',
      stop: '#e9e5e1'
    },
    label: {
      color: '#291d08',
      fontSize: 10,
      fontFamily: 'Poppins,sans-serif'
    },
    tracker: {
      lineWidth: 0.5,
      lineColor: '#291d08',
      labelColor: '#291d08',
      backgroundColor: '#f3f1ef'
    }
  },
  curve: {
    width: 2,
    opacity: 1,
    color: '#291d08'
  },
  filters: {
    gradientOpacity: 0.3,
    point: {
      backgroundOpacity: {
        active: 1,
        drag: 1
      }
    },
    colors: colors.map((c) => ({
      point: c,
      curve: c,
      gradient: c,
      active: '#291d08',
      drag: '#291d08',
      dragBackground: c,
      activeBackground: c
    }))
  }
}

const graphScale: GraphScaleOverride = {
  dbSteps: 4
}

const Demo4 = () => {
  const [dragging, setDragging] = useState(false)
  const [filters, setFilters] = useState(customPreset)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const handleMouseLeave = () => {
    if (!dragging) setActiveIndex(-1)
  }

  const handleMouseEnter = ({ index }: { index: number }) => {
    if (!dragging) setActiveIndex(index)
  }

  const handleFilterChange = (filterEvent: FilterChangeEvent) => {
    const { index, ...filter } = filterEvent

    setFilters((prevFilters) => {
      const newFilters = [...prevFilters]
      newFilters[index] = { ...newFilters[index], ...filter }
      return newFilters
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f3f1ef] text-black">
      <div className="w-[840px] flex flex-col pt-1">
        <div>
          <FrequencyResponseGraph
            width={840}
            height={480}
            theme={graphTheme}
            scale={graphScale}
          >
            {filters.map((filter, index) => (
              <>
                <FilterGradient
                  fill
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
                showIcon
                active={activeIndex === index}
                onDrag={setDragging}
                onEnter={handleMouseEnter}
                onLeave={handleMouseLeave}
                onChange={handleFilterChange}
              />
            ))}
            {!dragging && <PointerTracker />}
          </FrequencyResponseGraph>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Demo4

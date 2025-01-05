import { useState } from 'react'
import {
  FrequencyResponseGraph,
  CompositeCurve,
  FilterCurve,
  FilterGradient,
  FilterPoint,
  type FilterChangeEvent,
  MouseTracker,
  GraphFilter
} from 'dsssp'

import { AppHeaderBar, FilterCard } from './components'

import styles from './App1.module.css'

import customFilters from './configs/filters'
import theme from './configs/theme'
import scale from './configs/scale'

function App() {
  const [filters, setFilters] = useState(customFilters)
  const [dragging, setDragging] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const handleFilterChange = ({ index, ...filter }: FilterChangeEvent) => {
    setFilters((prevFilters) => {
      const newFilters = [...prevFilters]
      newFilters[index] = { ...newFilters[index], ...filter }
      return newFilters
    })
  }

  const getLabel = (index: number) => {
    return String.fromCharCode(65 + index)
  }

  const handleMouseLeave = () => {
    if (!dragging) setActiveIndex(-1)
  }

  const handleMouseEnter = ({ index }: { index: number }) => {
    if (!dragging) setActiveIndex(index)
  }

  const handlePresetChange = (filters: GraphFilter[]) => {
    console.log('preset change', filters)
  }

  return (
    <div className="bg-zinc-950 text-white text-sans min-h-screen flex flex-col items-center">
      <div className="max-w-[840px] pt-1 flex flex-col gap-1">
        <AppHeaderBar onPresetChange={handlePresetChange} />

        <div className="shadow-sm shadow-black relative">
          <FrequencyResponseGraph
            width={840}
            height={360}
            theme={theme}
            scale={scale}
          >
            {filters.map((filter, i) => (
              <FilterGradient
                key={i}
                index={i}
                filter={filter}
                id={`filter-${i}`}
              />
            ))}

            {filters.map((filter, i) => (
              <FilterCurve
                key={i}
                showPin
                index={i}
                filter={filter}
                active={activeIndex === i}
                gradientId={`filter-${i}`}
              />
            ))}
            <CompositeCurve filters={filters} />
            {filters.map((filter, i) => (
              <FilterPoint
                key={i}
                index={i}
                filter={filter}
                active={activeIndex === i}
                // label={getLabel(i)}
                onDrag={setDragging}
                onEnter={handleMouseEnter}
                onLeave={handleMouseLeave}
                onChange={handleFilterChange}
              />
            ))}
            {!dragging && <MouseTracker />}
          </FrequencyResponseGraph>
          <div className={styles.glareOverlay}></div>
        </div>

        <div className="flex gap-1 w-full">
          {filters.map((filter, index) => (
            <FilterCard
              index={index}
              filter={filter}
              active={activeIndex === index}
              onLeave={handleMouseLeave}
              onEnter={handleMouseEnter}
              onChange={handleFilterChange}
            />
          ))}
        </div>
        {/* <div className="mt-4">
          The intent of this demo is to show how to use the DSSSP library to
          create a parametric equalizer. The filters are represented by the
          colored curves and the filter points can be dragged to change the
          filter parameters. The frequency response of the filters is shown in
          the graph. The filters can be added or removed by modifying the
          filters array in the App component. The filters are applied in the
          order they are defined in the array. The filters are implemented using
          the biquad filter implementation in the Web Audio API.
        </div> */}
      </div>
    </div>
  )
}

export default App

import {
  calcFrequency,
  CompositeCurve,
  FilterCurve,
  FilterGradient,
  FrequencyResponseGraph,
  type GraphFilter,
  type GraphScaleOverride,
  type GraphThemeOverride
} from 'dsssp'
import { useEffect, useState } from 'react'

import RestartIcon from '../assets/restart.svg?react'

import NavBar from './components/NavBar'

const colors = ['#f9a900', '#ff5900', '#ca071a', '#5e007d', '#001747']

const graphTheme: GraphThemeOverride = {
  background: {
    grid: {
      lineColor: '#000000',
      lineWidth: { minor: 0, major: 0, center: 0, border: 0 }
    },
    gradient: {
      start: '#ffffff',
      stop: '#ffffff'
    },
    label: {
      color: '#000000'
    }
  },
  curve: {
    width: 2,
    opacity: 1
  },
  filters: {
    gradientOpacity: 1,
    colors: colors.map((c) => ({
      point: c,
      curve: c,
      gradient: c
    }))
  }
}

const scale: GraphScaleOverride = {
  dbLabels: false,
  octaveTicks: 0,
  octaveLabels: [],
  minFreq: 20,
  maxFreq: 20000,
  minGain: -12,
  maxGain: 12
}

const width = 840
const height = 480

const Demo4 = () => {
  const [filters, setFilters] = useState<GraphFilter[]>([])

  const createFilters = () => {
    // Create array of gains where half are guaranteed positive
    const gains = Array.from({ length: colors.length }, (_, index) => {
      if (index < Math.ceil(colors.length / 2)) {
        // First half: positive gains (0 to 8)
        return Math.random() * 6
      } else {
        // Second half: full range (-8 to 0)
        return Math.random() * -6
      }
    })
    setFilters(
      Array.from({ length: colors.length }, (_, index) => ({
        freq: calcFrequency(
          Math.floor(Math.random() * (width - 400)) + 200,
          width,
          scale.minFreq!,
          scale.maxFreq!
        ),
        gain: gains[index],
        q: Math.random() * 2 + 0.5,
        type: 'PEAK' as const
      }))
      //.sort((a, b) => a.freq - b.freq)
    )
  }

  useEffect(() => {
    createFilters()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f3f1ef] text-black">
      <div className="w-[840px] flex flex-col pt-1">
        <div className="relative">
          <FrequencyResponseGraph
            width={width}
            height={height}
            theme={graphTheme}
            scale={scale}
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
                  key={index}
                  index={index}
                  filter={filter}
                  gradientId={`filter-${index}`}
                  easing="easeInOut"
                  duration={300}
                  animate
                />
              </>
            ))}
            <FilterGradient
              fill
              opacity={1}
              color="#000000"
              id="composite-curve"
            />
            <CompositeCurve // WE ARE VENOM!
              color="#000000"
              lineWidth={1}
              filters={filters}
              gradientId="composite-curve"
              easing="easeInOut"
              duration={300}
              animate
            />
          </FrequencyResponseGraph>
          <button
            className="absolute bottom-0 left-[50%] my-4 ml-[-22px] p-1 bg-white hover:bg-[#f3f1ef] active:bg-[#ffe] rounded-md text-lg font-semibold text-black border-2 border-black inline-block"
            onClick={createFilters}
          >
            <RestartIcon className="w-8 h-8" />
          </button>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Demo4

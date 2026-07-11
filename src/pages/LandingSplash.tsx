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
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// synthwave sunset palette — warm-leaning (red / orange / yellow) with cool accents
const colors = ['#ff2e63', '#ff6b35', '#ffcf3f', '#e05cff', '#22d3ee']

const graphTheme: GraphThemeOverride = {
  background: {
    // grid off — the glow signature belongs to the curves, not the grid
    grid: {
      lineColor: '#000000',
      lineWidth: { minor: 0, major: 0, center: 0, border: 0 }
    },
    // fully black field
    gradient: {
      start: '#000000',
      stop: '#000000'
    },
    label: { color: '#6a5cff' }
  },
  curve: { width: 2, opacity: 1 },
  filters: {
    gradientOpacity: 0.6,
    colors: colors.map((c) => ({ point: c, curve: c, gradient: c }))
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

const createFilters = (): GraphFilter[] => {
  // half guaranteed boosts, half cuts — keeps the shape lively
  const gains = Array.from({ length: colors.length }, (_, index) =>
    index < Math.ceil(colors.length / 2)
      ? Math.random() * 6
      : Math.random() * -6
  )
  return Array.from({ length: colors.length }, (_, index) => ({
    // spread across the mid ~15-85% of the log range, independent of pixel width
    freq: calcFrequency(
      Math.random() * 70 + 15,
      100,
      scale.minFreq!,
      scale.maxFreq!
    ),
    gain: gains[index],
    q: Math.random() * 2 + 0.5,
    type: 'PEAK' as const
  }))
}

const LandingSplash = () => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [filters, setFilters] = useState<GraphFilter[]>(createFilters)

  // responsive: track the container size and feed it to the SVG graph
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width: Math.round(width), height: Math.round(height) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // looped random animation
  useEffect(() => {
    const id = setInterval(() => setFilters(createFilters()), 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000000'
      }}
    >
      {size.width > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            // neon "glow tube" signature — warm dual bloom on the curves
            filter:
              'drop-shadow(0 0 7px rgba(255, 46, 99, 0.5)) drop-shadow(0 0 22px rgba(255, 150, 60, 0.3))'
          }}
        >
          <FrequencyResponseGraph
            width={size.width}
            height={size.height}
            theme={graphTheme}
            scale={scale}
          >
            {filters.map((filter, index) => (
              <FilterGradient
                fill
                key={`g-${index}`}
                index={index}
                filter={filter}
                id={`l-${index}`}
              />
            ))}
            {filters.map((filter, index) => (
              <FilterCurve
                key={`c-${index}`}
                index={index}
                filter={filter}
                gradientId={`l-${index}`}
                easing="easeInOut"
                duration={1400}
                animate
              />
            ))}
            <FilterGradient
              fill
              opacity={0.6}
              color="#ff8a3d"
              id="l-composite"
            />
            <CompositeCurve
              color="#fff4e6"
              lineWidth={2}
              filters={filters}
              gradientId="l-composite"
              easing="easeInOut"
              duration={1400}
              animate
            />
          </FrequencyResponseGraph>
        </div>
      )}
    </div>
  )
}

export default LandingSplash

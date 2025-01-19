import clsx from 'clsx'
import {
  getZeroFreq,
  getZeroGain,
  getZeroQ,
  type FilterChangeEvent,
  type GraphFilter
} from 'dsssp'
import { useEffect, useMemo, useState } from 'react'
import tailwindColors from 'tailwindcss/colors'

import filterColors from '../../configs/colors'

import { FilterInput, FilterSelect, SliderInput } from '.'
import { generateNoise } from './utils'

const FilterCard = ({
  index = -1,
  active,
  filter,
  disabled,
  onEnter,
  onLeave,
  onChange
}: {
  index: number
  active: boolean
  filter: GraphFilter
  disabled: boolean
  onLeave?: () => void
  onEnter?: (event: FilterChangeEvent) => void
  onChange: (event: FilterChangeEvent) => void
}) => {
  const [noiseDataUrl, setNoiseDataUrl] = useState<string>('')
  // eslint-disable-next-line no-param-reassign
  if (disabled) filter = { type: 'BYPASS', freq: 0, gain: 0, q: 1 }
  const { type } = filter

  const zeroFreq = useMemo(() => getZeroFreq(type), [type])
  const zeroGain = useMemo(() => getZeroGain(type), [type])
  const zeroQ = useMemo(() => getZeroQ(type), [type])

  const color =
    type === 'BYPASS'
      ? tailwindColors.slate[400]
      : filterColors[index].active || '#FFFFFF'

  useEffect(() => {
    const noise = generateNoise(50, 50, 0.1)
    setNoiseDataUrl(noise)
  }, [])

  return (
    <div
      onMouseEnter={() => onEnter?.({ ...filter, index })}
      onMouseLeave={onLeave}
      className={clsx(
        'flex flex-col flex-1 gap-2 items-center shadow-sm border rounded-sm p-2 text-center transition-colors duration-200 bg-zinc-900 overflow-hidden',
        active && !disabled ? ' border-zinc-600' : ' border-zinc-800'
      )}
      style={{
        backgroundImage: `url(${noiseDataUrl})`,
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay'
      }}
    >
      <FilterSelect
        color={color}
        filter={filter}
        disabled={disabled}
        onChange={(type) => onChange({ ...filter, index, type, ended: true })}
      />

      <FilterInput
        suffix="Hz"
        precision={0}
        label="Frequency"
        value={filter.freq}
        disabled={disabled || zeroFreq}
        onChange={(freq) => onChange({ ...filter, index, freq, ended: true })}
      />

      <div className="flex flex-row gap-2 w-full">
        <SliderInput
          max={10}
          min={-10}
          step={0.1}
          label="Gain"
          value={filter.gain}
          disabled={disabled || zeroGain}
          onChange={(gain, ended) =>
            onChange({ ...filter, index, gain, ended })
          }
        />

        <SliderInput
          log
          max={10}
          min={0.1}
          step={0.1}
          label="Q"
          value={filter.q}
          disabled={disabled || zeroQ}
          onChange={(q, ended) => onChange({ ...filter, index, q, ended })}
        />
      </div>
    </div>
  )
}

export default FilterCard

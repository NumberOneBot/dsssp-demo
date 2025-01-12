import { useEffect, useState } from 'react'
import { FilterChangeEvent, type GraphFilter } from 'dsssp'
import tailwindColors from 'tailwindcss/colors'
import clsx from 'clsx'

import { FilterInput, FilterSelect, SliderInput } from '.'
import filterColors from '../configs/colors'

export const generateNoise = (
  width: number = 200,
  height: number = 200,
  opacity: number = 0.05
): string => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const imageData = ctx.createImageData(width, height)
    const buffer32 = new Uint32Array(imageData.data.buffer)
    const alpha = Math.round(opacity * 255)

    for (let i = 0; i < buffer32.length; i++) {
      const color = (Math.random() * 255) | 0
      buffer32[i] =
        (alpha << 24) | // Альфа
        (color << 16) | // Красный
        (color << 8) | // Зеленый
        color // Синий
    }
    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL()
  }

  return ''
}
const FilterCard = ({
  index = -1,
  active,
  filter,
  onEnter,
  onLeave,
  onChange
}: {
  index: number
  active: boolean
  filter: GraphFilter
  onLeave?: () => void
  onEnter?: (event: FilterChangeEvent) => void
  onChange: (event: FilterChangeEvent) => void
}) => {
  const [noiseDataUrl, setNoiseDataUrl] = useState<string>('')

  useEffect(() => {
    const noise = generateNoise(50, 50, 0.1)
    setNoiseDataUrl(noise)
  }, [])

  const color =
    filter.type === 'BYPASS'
      ? tailwindColors.slate[400]
      : filterColors[index].active || '#FFFFFF'

  return (
    <div
      onMouseEnter={() => onEnter?.({ ...filter, index })}
      onMouseLeave={onLeave}
      className={clsx(
        'flex flex-col flex-1 gap-2 items-center shadow-sm border rounded-sm p-2 text-center transition-colors duration-200 bg-zinc-900 overflow-hidden',
        active ? ' border-zinc-600' : ' border-zinc-800'
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
        onChange={(type) => onChange({ ...filter, index, type, ended: true })}
      />

      <FilterInput
        suffix="Hz"
        precision={0}
        label="Frequency"
        value={filter.freq}
        onChange={(freq) => onChange({ ...filter, index, freq, ended: true })}
      />

      <div className="flex flex-row gap-2 w-full">
        <SliderInput
          max={10}
          min={-10}
          step={0.1}
          label="Gain"
          value={filter.gain}
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
          onChange={(q, ended) => onChange({ ...filter, index, q, ended })}
        />
      </div>
    </div>
  )
}

export default FilterCard

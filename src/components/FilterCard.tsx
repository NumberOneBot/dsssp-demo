import { useEffect, useState } from 'react'
import { FilterChangeEvent, type GraphFilter } from 'dsssp'
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
  const iconColor = filterColors[index] || '#FFFFFF'

  const [noiseDataUrl, setNoiseDataUrl] = useState<string>('')

  useEffect(() => {
    const noise = generateNoise(50, 50, 0.1)
    setNoiseDataUrl(noise)
  }, [])

  return (
    <div
      onMouseEnter={() => onEnter?.({ index })}
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
        filter={filter}
        color={active ? iconColor.active : iconColor.point}
        onChange={(type) => onChange({ index, type })}
      />

      <FilterInput
        suffix="Hz"
        precision={0}
        label="Frequency"
        value={filter.freq}
        onChange={(freq) => onChange({ index, freq })}
      />

      <div className="flex flex-row gap-2 w-full">
        <SliderInput
          max={6}
          min={-6}
          step={0.1}
          label="Gain"
          value={filter.gain}
          onChange={(gain) => onChange({ index, gain })}
        />

        <SliderInput
          log
          max={10}
          min={0.1}
          step={0.1}
          label="Q"
          value={filter.q}
          onChange={(q) => onChange({ index, q })}
        />
      </div>
    </div>
  )
}

export default FilterCard

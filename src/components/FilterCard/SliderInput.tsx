import clsx from 'clsx'
import { useRef } from 'react'
import tailwindColors from 'tailwindcss/colors'

import { FilterInput } from '.'
import styles from './SliderInput.module.css'

const SliderInput = ({
  value,
  onChange,
  min = 0.1,
  max = 100,
  step = 1,
  height = 96,
  label,
  log = false,
  disabled
}: {
  value: number
  onChange: (value: number, ended: boolean) => void
  min?: number
  max?: number
  step?: number
  height?: number
  label?: string
  log?: boolean
  disabled?: boolean
}) => {
  const dragging = useRef(false)

  const linearToLog = (linear: number): number => {
    const minv = Math.log(min)
    const maxv = Math.log(max)
    const scale = (maxv - minv) / 100
    return Math.exp(minv + scale * linear)
  }

  const logToLinear = (log: number): number => {
    const minv = Math.log(min)
    const maxv = Math.log(max)
    const scale = (maxv - minv) / 100
    return (Math.log(log) - minv) / scale
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value)
    if (log) newValue = linearToLog(newValue)
    onChange(newValue, false)
  }

  const handleMouseUp = () => {
    if (!dragging.current) return
    dragging.current = false
    onChange(value, true)
  }

  const handleTouchEnd = () => {
    if (!dragging.current) return
    dragging.current = false
    onChange(value, true)
  }

  const handleMouseDown = () => (dragging.current = true)
  const handleTouchStart = () => (dragging.current = true)

  const sliderValue = log ? logToLinear(value) : value

  const calcPercentage = () => {
    if (log) {
      const logMin = Math.log(min)
      const logMax = Math.log(max)
      return ((Math.log(value) - logMin) / (logMax - logMin)) * 100
    } else {
      return ((sliderValue - min) / (max - min)) * 100
    }
  }

  const percentage = calcPercentage()

  const zeroPercentage = ((0 - min) / (max - min)) * 100

  const fillStart = percentage < zeroPercentage ? percentage : zeroPercentage
  const fillEnd = percentage < zeroPercentage ? zeroPercentage : percentage
  const fillColor = disabled
    ? tailwindColors.black
    : log
      ? tailwindColors.cyan[700]
      : value > 0
        ? tailwindColors.green[700]
        : tailwindColors.red[800]

  return (
    <div>
      {label && (
        <div
          className={clsx(
            'pb-1 text-sm font-semibold text-zinc-500 drop-shadow-lg transition-opacity duration-150',
            { 'opacity-50 pointer-events-none': disabled }
          )}
        >
          {label}
        </div>
      )}
      <div className="py-1 w-full rounded-sm">
        <div
          className={clsx(
            'mx-auto flex items-center justify-center transition-opacity duration-150',
            {
              'opacity-50 pointer-events-none': disabled
            }
          )}
          style={{ height, width: '38px' }}
        >
          <input
            type="range"
            min={log ? 0 : min}
            max={log ? 100 : max}
            step={step}
            value={sliderValue}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={styles.slider}
            style={
              {
                width: height,
                '--fill-color': fillColor,
                '--fill-start': `${fillStart}%`,
                '--fill-end': `${fillEnd}%`
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <div className="pt-1">
        <FilterInput
          value={value}
          min={log ? 0 : min}
          max={log ? 100 : max}
          precision={2}
          disabled={disabled}
          onChange={(value) => onChange(value, true)}
        />
      </div>
    </div>
  )
}

export default SliderInput

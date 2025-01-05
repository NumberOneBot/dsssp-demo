import { FilterInput } from '.'
import styles from './SliderInput.module.css'
import colors from 'tailwindcss/colors'

const SliderInput = ({
  value,
  onChange,
  min = 0.1,
  max = 100,
  step = 1,
  height = 96,
  label,
  log = false
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  height?: number
  label?: string
  log?: boolean
}) => {
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
    onChange(newValue)
  }

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
  const fillColor = log
    ? colors.cyan[700]
    : value > 0
      ? colors.green[700]
      : colors.red[800]

  return (
    <div>
      {label && (
        <div className="pb-1 text-sm font-semibold text-zinc-500 drop-shadow-lg">
          {label}
        </div>
      )}
      <div className="py-1 w-full rounded-sm">
        <div
          className="mx-auto flex items-center justify-center "
          style={{ height, width: '38px' }}
        >
          <input
            type="range"
            min={log ? 0 : min}
            max={log ? 100 : max}
            step={step}
            value={sliderValue}
            onChange={handleChange}
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
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default SliderInput

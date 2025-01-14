import clsx from 'clsx'
import type React from 'react';
import { useEffect, useState } from 'react'

const FilterInput = ({
  value,
  onChange,
  prefix,
  suffix,
  label,
  disabled,
  precision = 1
}: {
  value: number
  onChange?: (value: number) => void
  prefix?: string
  suffix?: string
  label?: string
  disabled?: boolean
  precision?: number
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toFixed(precision))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    const num = Number(inputValue)
    if (!isNaN(num)) {
      onChange?.(num)
    } else {
      setInputValue(value.toFixed(precision))
    }
  }
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const num = Number(inputValue)
      if (!isNaN(num)) {
        onChange?.(num)
      }
    }
  }

  useEffect(() => {
    setInputValue(value.toFixed(precision))
  }, [value])

  return (
    <div
      className={clsx('flex flex-col transition-opacity duration-150', {
        'opacity-50 pointer-events-none': disabled
      })}
    >
      {label && (
        <label className="mb-1 text-sm font-semibold text-zinc-500 drop-shadow-lg">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={disabled ? '' : inputValue}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          className={clsx(
            'appearance-none block w-full text-center shadow-md bg-zinc-950 text-white border border-zinc-700 rounded-sm py-0.5 focus:outline-none focus:ring-sky-500 focus:border-sky-500',
            { 'pl-10': prefix },
            { 'pr-8': suffix }
          )}
        />

        {suffix && (
          <span className="absolute top-[1px] right-[1px] bottom-[1px] flex items-center px-2 pointer-events-none rounded-r-sm text-zinc-500 text-sm text-center bg-zinc-900 border-l border-zinc-800 bg-opacity-80">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default FilterInput

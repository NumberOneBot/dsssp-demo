import { useState } from 'react'
import { type BiQuadCoefficients, type GraphFilter } from 'dsssp'

import presets from '../configs/presets'

import { MusicPlayer } from '.'
import clsx from 'clsx'

const AppHeaderBar = ({
  altered = false,
  coefficients,
  onPresetChange,
  onPowerChange
}: {
  altered?: boolean
  coefficients: BiQuadCoefficients[]
  onPresetChange: (
    newFilters: GraphFilter[],
    newIndex: number,
    prevIndex: number
  ) => void
  onPowerChange: (powered: boolean) => void
}) => {
  const [powered, setPowered] = useState(true)
  const [presetIndex, setPresetIndex] = useState(0)

  const handlePrevClick = () => {
    const newIndex = (presetIndex - 1 + presets.length) % presets.length
    onPresetChange(presets[newIndex].filters, newIndex, presetIndex)
    setPresetIndex(newIndex)
  }

  const handleNextClick = () => {
    const newIndex = (presetIndex + 1) % presets.length
    onPresetChange(presets[newIndex].filters, newIndex, presetIndex)
    setPresetIndex(newIndex)
  }

  const handleResetClick = () => {
    onPresetChange(presets[presetIndex].filters, presetIndex, presetIndex)
  }

  const togglePower = () => {
    setPowered(!powered)
    onPowerChange(!powered)
  }

  const buttonClasses =
    'px-2 py-1 m-[-1px] text-sm bg-black border border-zinc-800 rounded-sm hover:bg-zinc-950 hover:text-zinc-300 focus-visible:z-10 focus:outline-none focus-visible:border-sky-500 active:border-zinc-500 active:z-10'

  return (
    <div className="flex flex-row w-full gap-2 py-2 px-3 bg-black text-zinc-500  border border-zinc-800 rounded-sm shadow-sm items-center justify-between">
      <div className="flex flex-row gap-3">
        <button
          className={clsx(buttonClasses, 'px-3 m-[0]', {
            'text-green-600 hover:text-green-400 ': powered,
            'text-red-700 hover:text-red-500 ': !powered
          })}
          onClick={togglePower}
          aria-label="Power"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-dasharray="42.3 10"
              stroke-dashoffset="0"
            />
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <div
          className={clsx(
            'flex flex-row gap-3 transition-opacity duration-150',
            {
              'opacity-100 pointer-events-auto': powered,
              'opacity-50 pointer-events-none': !powered
            }
          )}
        >
          <div className="flex flex-row border rounded-sm border-zinc-800 relative">
            <div className="w-[140px] py-1 px-3 text-center">
              {presets[presetIndex].name}
            </div>

            <button
              className={buttonClasses}
              onClick={handlePrevClick}
              aria-label="Previous preset"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              className={buttonClasses}
              onClick={handleNextClick}
              aria-label="Next preset"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <button
            className={clsx(
              buttonClasses,
              'px-3 text-xs uppercase transition-opacity duration-150',
              {
                'opacity-0 pointer-events-none': !altered,
                'opacity-100': altered,
                'pointer-events-auto': altered && powered
              }
            )}
            onClick={handleResetClick}
            aria-label="reset"
          >
            Reset
          </button>
        </div>
      </div>

      <MusicPlayer
        coefficients={coefficients}
        powered={powered}
      />
    </div>
  )
}

export default AppHeaderBar

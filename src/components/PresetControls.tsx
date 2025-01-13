import { useState } from 'react'
import clsx from 'clsx'

import LeftArrowIcon from '../assets/left-arrow.svg?react'
import RightArrowIcon from '../assets/right-arrow.svg?react'
import presets from '../configs/presets'
import type { GraphFilter } from 'dsssp'

export const buttonClasses =
  'px-2 py-1 m-[-1px] text-sm bg-black border border-zinc-800 rounded-sm hover:bg-zinc-950 hover:text-zinc-300 focus-visible:z-10 focus:outline-none focus-visible:border-sky-500 active:border-zinc-500 active:z-10'

const PresetControl = ({
  powered,
  altered,
  onPresetChange
}: {
  powered: boolean
  altered: boolean
  onPresetChange: (
    newFilters: GraphFilter[],
    newIndex: number,
    prevIndex: number
  ) => void
}) => {
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

  return (
    <div
      className={clsx('flex flex-row gap-3 transition-opacity duration-150', {
        'opacity-100 pointer-events-auto': powered,
        'opacity-50 pointer-events-none': !powered
      })}
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
          <LeftArrowIcon className="w-4 h-4" />
        </button>

        <button
          className={buttonClasses}
          onClick={handleNextClick}
          aria-label="Next preset"
        >
          <RightArrowIcon className="w-4 h-4" />
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
  )
}

export default PresetControl

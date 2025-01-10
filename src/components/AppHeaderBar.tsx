import { useState } from 'react'
import { type GraphFilter } from 'dsssp'

import presets from '../configs/presets'

import { MusicPlayer } from '.'

const AppHeaderBar = ({
  onPresetChange
}: {
  onPresetChange: (
    newFilters: GraphFilter[],
    newIndex: number,
    prevIndex: number
  ) => void
}) => {
  const buttonClasses =
    'px-2 py-1 m-[-1px] text-sm text-zinc-500 bg-black border border-zinc-800 rounded-sm hover:bg-zinc-950 hover:text-zinc-300 focus-visible:z-10 focus:outline-none focus-visible:border-sky-500 active:border-zinc-500 active:z-10'

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

  // const handleReset = () => {
  //   onPresetChange(presets[presetIndex].filters, presetIndex, presetIndex)
  // }

  return (
    <div className="flex flex-row w-full gap-2 py-2 px-3 bg-black border border-zinc-800 rounded-sm shadow-sm items-center justify-between">
      <div className="flex flex-row border rounded-sm border-zinc-800 relative">
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
        <div className="text-zinc-500 w-[160px] py-1 px-3 text-center">
          {presets[presetIndex].name}
        </div>
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

      <MusicPlayer />
    </div>
  )
}

export default AppHeaderBar

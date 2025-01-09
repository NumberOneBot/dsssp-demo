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
    'px-2.5 py-1 m-[-1px] text-sm text-zinc-500 bg-black border border-zinc-800 rounded-sm hover:bg-zinc-950 hover:text-zinc-300 focus-visible:z-10 focus:outline-none focus-visible:border-sky-500 active:border-zinc-500 active:z-10'

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
      <h1 className="px-1 text-2xl font-mono">DSSSP</h1>

      <MusicPlayer />

      <div className="flex flex-row border rounded-sm border-zinc-800 relative">
        <div className="text-zinc-500 w-[140px] py-1 px-3 text-center">
          {presets[presetIndex].name}
        </div>
        <button
          className={buttonClasses}
          onClick={handlePrevClick}
        >
          &#129120;
        </button>
        <button
          className={buttonClasses}
          onClick={handleNextClick}
        >
          &#129122;
        </button>
      </div>
    </div>
  )
}

export default AppHeaderBar

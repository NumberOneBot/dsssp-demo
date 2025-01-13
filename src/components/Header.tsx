import { useState } from 'react'
import { type BiQuadCoefficients, type GraphFilter } from 'dsssp'
import clsx from 'clsx'

import PowerIcon from '../assets/power.svg?react'
import { MusicPlayer } from '.'
import PresetControls, { buttonClasses } from './PresetControls'

const Header = ({
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

  const togglePower = () => {
    setPowered(!powered)
    onPowerChange(!powered)
  }

  return (
    <div className="flex flex-row w-full gap-2 py-2 px-3 bg-black text-zinc-500  border border-zinc-800 rounded-sm shadow-sm items-center justify-between">
      <div className="flex flex-row gap-3">
        <button
          className={clsx(buttonClasses, 'px-3 m-[0] h-[34px]', {
            'text-green-600 hover:text-green-400 ': powered,
            'text-red-700 hover:text-red-500 ': !powered
          })}
          onClick={togglePower}
          aria-label="Power"
        >
          <PowerIcon className="w-3.5 h-3.5" />
        </button>

        <PresetControls
          powered={powered}
          altered={altered}
          onPresetChange={onPresetChange}
        />
      </div>

      <MusicPlayer
        powered={powered}
        coefficients={coefficients}
      />
    </div>
  )
}

export default Header
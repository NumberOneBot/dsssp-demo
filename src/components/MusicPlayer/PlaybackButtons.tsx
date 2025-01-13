import clsx from 'clsx'

import PlayIcon from '../../assets/play.svg?react'
import PauseIcon from '../../assets/pause.svg?react'
import StopIcon from '../../assets/stop.svg?react'

export const PlaybackButtons = ({
  playing,
  onStop,
  onToggle
}: {
  playing: boolean
  onStop: () => void
  onToggle: () => void
}) => {
  const buttonClasses = clsx(
    'm-[-1px] rounded-sm border border-zinc-800 w-[34px] h-[34px] px-2 text-zinc-500 bg-black rounded-sm',
    'hover:bg-zinc-950 font-mono hover:text-zinc-300',
    'focus-visible:z-10 focus:outline-none focus-visible:border-sky-500 active:border-zinc-500 active:z-10'
  )

  return (
    <div className="flex flex-row border rounded-sm border-zinc-800 relative">
      <button
        className={clsx(buttonClasses, !playing && 'text-sm ')}
        aria-label="Toggle playback"
        onClick={onToggle}
      >
        {playing ? (
          <PauseIcon className="w-4 h-4" />
        ) : (
          <PlayIcon className="w-4 h-4" />
        )}
      </button>
      <button
        onClick={onStop}
        className={buttonClasses}
        aria-label="Stop"
      >
        <StopIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

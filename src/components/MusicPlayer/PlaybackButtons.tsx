import clsx from 'clsx'

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
    'm-[-1px] rounded-sm border border-zinc-800 w-[34px] h-[34px] text-zinc-500 bg-black rounded-sm',
    'hover:bg-zinc-950 font-mono hover:text-zinc-300',
    'focus-visible:z-10 focus:outline-none focus-visible:border-sky-500 active:border-zinc-500 active:z-10'
  )

  return (
    <div className="flex flex-row border rounded-sm border-zinc-800 relative">
      <button
        className={clsx(buttonClasses, !playing && 'text-sm leading-[34px]')}
        aria-label="Toggle playback"
        onClick={onToggle}
      >
        {playing ? '\u23F8' : '\u25B6'}
      </button>
      <button
        onClick={onStop}
        className={buttonClasses}
        aria-label="Stop"
      >
        &#9632;
      </button>
    </div>
  )
}

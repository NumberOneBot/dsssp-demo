import React from 'react'
import clsx from 'clsx'

interface PlayButtonProps {
  playing: boolean
  onClick: () => void
  className?: string
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  playing,
  onClick,
  className
}) => {
  const buttonClasses = clsx(
    'rounded-sm border border-zinc-800 w-[34px] h-[34px] text-zinc-500 bg-black rounded-sm',
    'hover:bg-zinc-950 font-mono hover:text-zinc-300',
    'focus-visible:z-10 focus:outline-none focus-visible:border-sky-500 active:border-zinc-500 active:z-10',
    className
  )

  return (
    <button
      className={clsx(buttonClasses, !playing && 'text-sm leading-[34px]')}
      onClick={onClick}
    >
      {playing ? '\u23F8' : '\u25B6'}
    </button>
  )
}

import React from 'react'
import clsx from 'clsx'

import { CoversStack } from '.'
import { tracks } from '../../configs/tracks'

export interface TrackInfoProps {
  activeIndex: number
  currentTime: string
  duration: string
  loading: boolean
  onChangeTrack?: (next: number) => void
}

export const TrackInfo: React.FC<TrackInfoProps> = ({
  activeIndex,
  currentTime,
  duration,
  loading,
  onChangeTrack
}) => {
  const artist = tracks[activeIndex].artist
  const title = tracks[activeIndex].title
  const coverImages = tracks.map((track) => track.cover)

  if (loading) {
    currentTime = '0:00'
    duration = '0:00'
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <CoversStack
        covers={coverImages}
        active={activeIndex}
        onClick={() => onChangeTrack?.((activeIndex + 1) % tracks.length)}
      />
      <div className="w-[86px] flex flex-col h-full overflow-hidden items-start justify-center text-xs">
        <div className="text-zinc-300 whitespace-nowrap">{artist}</div>
        <div className="text-zinc-600 whitespace-nowrap">{title}</div>
      </div>
      <div
        className={clsx('flex flex-col h-full items-end justify-center', {
          'opacity-50 pointer-events-none': loading
        })}
      >
        <div className="text-zinc-600 text-xs">{currentTime}</div>
        <div className="text-zinc-600 text-xs">{duration}</div>
      </div>
    </div>
  )
}

export default TrackInfo

import type React from 'react'

import Spinner from '../../assets/spinner.svg?react'
import { tracks } from '../../configs/tracks'

import { CoversStack } from '.'

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
      <div className="flex flex-col h-full items-end justify-center pointer-events-none">
        {loading ? (
          <div className="h-3 w-[22px] px-1 text-zinc-600">
            <Spinner className="h-3 w-3" />
          </div>
        ) : (
          <>
            <div className="text-zinc-600 text-xs">{currentTime}</div>
            <div className="text-zinc-600 text-xs">{duration}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default TrackInfo

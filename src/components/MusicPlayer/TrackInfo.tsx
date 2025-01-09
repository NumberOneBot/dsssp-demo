import React from 'react'

interface TrackInfoProps {
  artist: string
  title: string
  currentTime: string
  duration: string
  coverImage: string
}

export const TrackInfo: React.FC<TrackInfoProps> = ({
  artist,
  title,
  currentTime,
  duration,
  coverImage
}) => (
  <>
    <div
      className="w-[34px] h-[34px] bg-center bg-cover"
      style={{ backgroundImage: `url(${coverImage})` }}
    />
    <div className="flex flex-col h-full items-start justify-center">
      <div className="text-zinc-300 text-xs">{artist}</div>
      <div className="text-zinc-600 text-xs">{title}</div>
    </div>
    <div className="flex flex-col h-full items-end justify-center">
      <div className="text-zinc-500 text-xs">{currentTime}</div>
      <div className="text-zinc-600 text-xs">{duration}</div>
    </div>
  </>
)

import React, { useEffect, useState } from 'react'

interface TrackInfoProps {
  artist: string
  title: string
  currentTime: string
  duration: string
  coverImages: string[]
}

export const TrackInfo: React.FC<TrackInfoProps> = ({
  artist,
  title,
  currentTime,
  duration,
  coverImages
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // const interval = setInterval(() => {
    //   setActiveIndex((prevIndex) => (prevIndex + 1) % coverImages.length)
    // }, 3000) // Change image every 3 seconds
    // return () => clearInterval(interval)
  }, [coverImages.length])

  return (
    <>
      <div className="w-[34px] h-[34px] relative">
        {coverImages.map((image, index) => (
          <img
            key={index}
            src={image}
            className={`absolute top-0 left-0 w-full h-full bg-zinc-800 transition-opacity duration-1000 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="min-w-[72px] flex flex-col h-full items-start justify-center">
        <div className="text-zinc-300 text-xs">{artist}</div>
        <div className="text-zinc-500 text-xs">{title}</div>
      </div>
      <div className="flex flex-col h-full items-end justify-center">
        <div className="text-zinc-500 text-xs">{currentTime}</div>
        <div className="text-zinc-600 text-xs">{duration}</div>
      </div>
    </>
  )
}

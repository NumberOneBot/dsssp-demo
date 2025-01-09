import { useEffect, useState, useRef } from 'react'
import { AudioController, TrackInfo, Visualizer, PlaybackButtons } from '.'

import { tracks } from '../../configs/tracks'

const MusicPlayer: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [activeTrack, setActiveTrack] = useState(0)

  const audioController = useRef(
    new AudioController({
      onTimeUpdate: setCurrentTime,
      onDurationChange: setDuration,
      onLoadingChange: setLoading,
      onTrackEnd: () => setPlaying(false)
    })
  )

  const handleStop = () => {
    setPlaying(false)
    setCurrentTime('0:00')
    audioController.current.stop()
  }

  useEffect(() => {
    audioController.current
      .init(tracks[activeTrack].src)
      .catch((error) => console.error('Failed to initialize audio:', error))

    return () => audioController.current.cleanup()
  }, [])

  useEffect(() => {
    if (playing) {
      audioController.current.play()
      audioController.current.updatePosition(playing)
    } else {
      audioController.current.pause()
    }
  }, [playing])

  const analysers = audioController.current.getAnalyserNodes()

  const handleChangeTrack = (nextTrack: number) => {
    setActiveTrack(nextTrack)
    setCurrentTime('0:00')
    audioController.current.stop()
    audioController.current.init(tracks[nextTrack].src)
    setPlaying(false)
  }

  if (loading) {
    return (
      <div className="w-[344px] text-sm text-zinc-600 font-sans text-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-[344px] flex flex-row gap-3 items-center">
      <TrackInfo
        activeIndex={activeTrack}
        currentTime={currentTime}
        duration={duration}
        onChangeTrack={handleChangeTrack}
      />
      <PlaybackButtons
        playing={playing}
        onStop={handleStop}
        onToggle={() => setPlaying(!playing)}
      />

      <div className="flex flex-col gap-2">
        <Visualizer
          analyser={analysers.left}
          width={96}
          height={6}
          maxFPS={30}
        />
        <Visualizer
          analyser={analysers.right}
          width={96}
          height={6}
          maxFPS={30}
        />
      </div>
    </div>
  )
}

export default MusicPlayer

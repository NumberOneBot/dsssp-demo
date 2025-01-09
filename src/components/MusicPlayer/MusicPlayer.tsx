import { useEffect, useState, useRef } from 'react'
import { AudioController, TrackInfo, Visualizer, PlaybackButtons } from '.'

import { tracks } from '../../configs/tracks'

const activeTrack = 0

const MusicPlayer: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')

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

  if (loading) {
    return (
      <div className="w-[340px] text-sm text-zinc-600 font-sans text-center w-full">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-[340px] flex flex-row gap-3 items-center">
      <TrackInfo
        artist={tracks[activeTrack].artist}
        title={tracks[activeTrack].title}
        coverImages={[tracks[activeTrack].cover]}
        currentTime={currentTime}
        duration={duration}
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

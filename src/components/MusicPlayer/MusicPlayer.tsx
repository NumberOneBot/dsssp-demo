import { useEffect, useState, useRef, useCallback } from 'react'
import clsx from 'clsx'

import { AudioController, TrackInfo, Visualizer, PlaybackButtons } from '.'
import { tracks } from '../../configs/tracks'

const MusicPlayer: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [activeTrack, setActiveTrack] = useState(0)
  const [analysers, setAnalysers] = useState<{
    left: AnalyserNode
    right: AnalyserNode
  } | null>(null)

  const audioController = useRef<AudioController | null>(null)

  useEffect(() => {
    audioController.current = new AudioController({
      onTimeUpdate: setCurrentTime,
      onTrackEnd: () => setPlaying(false),
      onDurationChange: setDuration,
      onLoadingChange: setLoading,
      onAnalyserReady: setAnalysers
    })

    audioController.current.init(tracks[activeTrack].src).catch((error) => {
      console.error('Failed to initialize audio:', error)
    })

    return () => {
      audioController.current?.cleanup()
    }
  }, [])

  const handleStop = () => {
    audioController.current?.stop()
    setCurrentTime('0:00')
    setPlaying(false)
  }

  useEffect(() => {
    if (audioController.current) {
      audioController.current.init(tracks[activeTrack].src).catch((error) => {
        console.error('Failed to initialize audio:', error)
      })
    }
  }, [activeTrack])

  useEffect(() => {
    if (playing) {
      audioController.current?.play()
      audioController.current?.updatePosition(playing)
    } else {
      audioController.current?.pause()
    }
  }, [playing])

  const handleChangeTrack = useCallback((nextTrack: number) => {
    audioController.current?.stop()
    setActiveTrack(nextTrack)
    setCurrentTime('0:00')
    setPlaying(false)
  }, [])

  return (
    <div className="w-[350px] flex flex-row gap-3 items-center justify-end">
      <TrackInfo
        activeIndex={activeTrack}
        currentTime={currentTime}
        duration={duration}
        loading={loading}
        onChangeTrack={handleChangeTrack}
      />

      <div className={clsx({ 'pointer-events-none': loading })}>
        <PlaybackButtons
          playing={playing}
          onStop={handleStop}
          onToggle={() => setPlaying(!playing)}
        />
      </div>

      <div className="flex flex-col gap-2 w-[96px]">
        {analysers && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

export default MusicPlayer

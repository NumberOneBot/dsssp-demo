import clsx from 'clsx'
import { type BiQuadCoefficients } from 'dsssp'
import { useEffect, useState, useRef, useCallback } from 'react'

import { tracks } from '../../configs/tracks'

import { AudioController, TrackInfo, Visualizer, PlaybackButtons } from '.'

const MusicPlayer = ({
  powered = true,
  coefficients
}: {
  powered?: boolean
  coefficients: BiQuadCoefficients[]
}) => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [activeTrack, setActiveTrack] = useState(0)
  const [analysers, setAnalysers] = useState<{
    left: AnalyserNode
    right: AnalyserNode
  } | null>(null)

  const emptyDuration = duration === '0:00'

  const audioController = useRef<AudioController | null>(null)

  const handleStop = () => {
    audioController.current?.stop()
    setCurrentTime('0:00')
    setPlaying(false)
  }

  useEffect(() => {
    audioController.current = new AudioController({
      onTimeUpdate: setCurrentTime,
      onTrackEnd: () => setPlaying(false),
      onDurationChange: setDuration,
      onLoadingChange: setLoading,
      onAnalyserReady: setAnalysers,
      filters: coefficients
    })

    audioController.current.init(tracks[activeTrack].src).catch((error) => {
      console.error('Failed to initialize audio:', error)
    })

    return () => {
      audioController.current?.cleanup()
    }
  }, [])

  useEffect(() => {
    if (audioController.current)
      audioController.current.updateFilters(coefficients)
  }, [coefficients])

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

  useEffect(() => {
    if (powered) {
      audioController.current?.enableFilters()
    } else {
      audioController.current?.disableFilters()
    }
  }, [powered])

  return (
    <div className="w-[350px] flex flex-row gap-3 items-center justify-end">
      <TrackInfo
        activeIndex={activeTrack}
        currentTime={currentTime}
        duration={duration}
        loading={loading || emptyDuration}
        onChangeTrack={handleChangeTrack}
      />

      <div
        className={clsx('transition-opacity duration-150', {
          'pointer-events-none opacity-50': loading || emptyDuration
        })}
      >
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

import { useEffect, useState, useRef } from 'react'
import {
  AudioController,
  TrackInfo,
  Visualizer,
  formatTime,
  PlaybackButtons
} from '.'

const demoTrackUrl =
  './assets/BalloonPlanet_-_Cool_My_Bass_-_EX-000386_-_Master_-_114_Bpm_-_021123_-_BOV_-_EXT_-_2444.aac'

const demoTrackCoverImage =
  './assets/914278_ArtWork_CoolMyBass_BalloonPlanet.png_-_A_-_500X500.jpg'

const MusicPlayer: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')

  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedAtRef = useRef<number>(0)
  const requestAnimationFrameIdRef = useRef<number | null>(null)
  const analyserLeftRef = useRef<AnalyserNode | null>(null) // Ref for left channel
  const analyserRightRef = useRef<AnalyserNode | null>(null) // Ref for right channel

  const audioController = new AudioController({
    audioContextRef,
    sourceNodeRef,
    audioBufferRef,
    startTimeRef,
    pausedAtRef,
    requestAnimationFrameIdRef,
    analyserLeftRef,
    analyserRightRef
  })

  useEffect(() => {
    audioController
      .init(demoTrackUrl, (duration) => setDuration(formatTime(duration)))
      .then(() => setLoading(false))
      .catch((error) => console.error('Failed to initialize audio:', error))

    return () => audioController.cleanup()
  }, [])

  useEffect(() => {
    if (playing) {
      audioController.play()
      audioController.updatePosition(playing, (time) =>
        setCurrentTime(formatTime(time))
      )
    } else {
      audioController.pause()
      if (requestAnimationFrameIdRef.current) {
        cancelAnimationFrame(requestAnimationFrameIdRef.current)
      }
    }
  }, [playing])

  const handleStop = () => {
    setPlaying(false)
    setCurrentTime('0:00')
    audioController.stop()
  }

  if (loading) {
    return (
      <div className="text-sm text-zinc-600 font-sans text-center w-full">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-3 items-center">
      <TrackInfo
        artist="BalloonPlanet"
        title="Cool My Bass"
        currentTime={currentTime}
        duration={duration}
        coverImage={demoTrackCoverImage}
      />
      <PlaybackButtons
        playing={playing}
        onStop={handleStop}
        onToggle={() => setPlaying(!playing)}
      />

      <div className="flex flex-col gap-2">
        <Visualizer
          analyser={analyserLeftRef.current}
          width={96}
          height={6}
        />
        <Visualizer
          analyser={analyserRightRef.current}
          width={96}
          height={6}
        />
      </div>
    </div>
  )
}

export default MusicPlayer

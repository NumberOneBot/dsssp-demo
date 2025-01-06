import { type GraphFilter } from 'dsssp'

export const customPreset: GraphFilter[] = [
  { freq: 100, gain: 4, q: 0.7, type: 'PEAK' },
  { freq: 200, gain: -6, q: 0.7, type: 'PEAK' },
  { freq: 400, gain: 7, q: 0.7, type: 'PEAK' },
  { freq: 800, gain: -8, q: 0.7, type: 'PEAK' },
  { freq: 1600, gain: 7, q: 0.7, type: 'PEAK' },
  { freq: 3200, gain: -6, q: 0.7, type: 'PEAK' },
  { freq: 6400, gain: 4, q: 0.7, type: 'PEAK' }
]

export const brightPreset: GraphFilter[] = [
  { freq: 60, gain: -1, q: 1, type: 'LOWSHELF2' },
  { freq: 400, gain: 0, q: 0.7, type: 'BYPASS' },
  { freq: 1000, gain: 4, q: 1.2, type: 'PEAK' },
  { freq: 2500, gain: 6, q: 1.2, type: 'PEAK' },
  { freq: 6400, gain: 6, q: 1.2, type: 'PEAK' },
  { freq: 12000, gain: 10, q: 0.8, type: 'HIGHSHELF2' },
  { freq: 16000, gain: 0, q: 1, type: 'BYPASS' }
]

export const excitedPreset: GraphFilter[] = [
  { freq: 60, gain: 8, q: 1, type: 'LOWSHELF2' },
  { freq: 400, gain: -1, q: 0.7, type: 'PEAK' },
  { freq: 1000, gain: 1, q: 0.7, type: 'PEAK' },
  { freq: 2500, gain: 0, q: 0.7, type: 'BYPASS' },
  { freq: 6400, gain: 2.5, q: 0.7, type: 'PEAK' },
  { freq: 12000, gain: 6, q: 0.7, type: 'HIGHSHELF2' },
  { freq: 16000, gain: 0, q: 1, type: 'BYPASS' }
]

export const mellowPreset: GraphFilter[] = [
  { freq: 60, gain: -3, q: 1, type: 'LOWSHELF2' },
  { freq: 400, gain: -1, q: 0.7, type: 'PEAK' },
  { freq: 1000, gain: -2, q: 0.5, type: 'PEAK' },
  { freq: 2500, gain: 0, q: 0.7, type: 'BYPASS' },
  { freq: 6400, gain: -4, q: 0.5, type: 'PEAK' },
  { freq: 16000, gain: -6, q: 0.5, type: 'PEAK' },
  { freq: 16000, gain: 0, q: 0.7, type: 'LOWPASS1' }
]

export const speechPreset: GraphFilter[] = [
  { freq: 60, gain: 0, q: 0.6, type: 'HIGHPASS2' },
  { freq: 400, gain: 4, q: 0.7, type: 'PEAK' },
  { freq: 1000, gain: 3, q: 0.7, type: 'PEAK' },
  { freq: 2500, gain: 1, q: 0.7, type: 'PEAK' },
  { freq: 6400, gain: 2, q: 0.7, type: 'PEAK' },
  { freq: 16000, gain: -10, q: 0.7, type: 'PEAK' },
  { freq: 16000, gain: 0, q: 0.7, type: 'LOWPASS1' }
]

export const vocalPreset: GraphFilter[] = [
  { freq: 60, gain: 0, q: 0.6, type: 'BYPASS' },
  { freq: 400, gain: 6, q: 0.7, type: 'PEAK' },
  { freq: 1000, gain: 4, q: 0.7, type: 'PEAK' },
  { freq: 2500, gain: 2, q: 0.7, type: 'PEAK' },
  { freq: 6400, gain: 3, q: 0.7, type: 'PEAK' },
  { freq: 16000, gain: -1, q: 0.7, type: 'LOWPASS1' },
  { freq: 16000, gain: 0, q: 0.7, type: 'BYPASS' }
]

export const flatPreset: GraphFilter[] = [
  { freq: 100, gain: 0, q: 0.7, type: 'PEAK' },
  { freq: 200, gain: 0, q: 0.7, type: 'PEAK' },
  { freq: 400, gain: 0, q: 0.7, type: 'PEAK' },
  { freq: 800, gain: 0, q: 0.7, type: 'PEAK' },
  { freq: 1600, gain: 0, q: 0.7, type: 'PEAK' },
  { freq: 3200, gain: 0, q: 0.7, type: 'PEAK' },
  { freq: 6400, gain: 0, q: 0.7, type: 'PEAK' }
]

const presets = [
  { name: 'Custom', filters: customPreset },
  { name: 'Bright', filters: brightPreset },
  { name: 'Excited', filters: excitedPreset },
  { name: 'Vocal', filters: vocalPreset },
  { name: 'Mellow', filters: mellowPreset },
  { name: 'Speech', filters: speechPreset },
  { name: 'Flat', filters: flatPreset }
]

export default presets

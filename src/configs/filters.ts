import { type GraphFilter } from 'dsssp'

const filters: GraphFilter[] = [
  { freq: 35, gain: 0, q: 0.7, type: 'HIGHPASS2' },
  { freq: 60, gain: 2, q: 0.7, type: 'PEAK' },
  { freq: 200, gain: -2, q: 0.7, type: 'PEAK' },
  { freq: 800, gain: 2, q: 0.7, type: 'PEAK' },
  { freq: 3200, gain: -2, q: 0.7, type: 'PEAK' },
  { freq: 9600, gain: 2, q: 0.7, type: 'PEAK' },
  { freq: 12000, gain: -4, q: 1, type: 'HIGHSHELF2' }
]

export default filters

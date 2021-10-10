import { SegmentProps } from '../types/SegmentProps'

const getSegmentState = (
  index: number,
  [start, end]: SegmentProps['selection'],
): SegmentProps['state'] => {
  if (typeof start !== 'number') return null
  if (typeof end !== 'number') return null
  if (start === end && start === index) return 'cursor'
  if (index >= start && index < end) return 'selected'
  return null
}

const getSegmentPosition = (
  index: number,
  [start, end]: SegmentProps['selection'],
): SegmentProps['position'] => {
  return index < start! ? -1 : index >= end! ? 1 : 0
}

export const getSegmentArray = (
  size: number,
  selection: SegmentProps['selection'],
) => {
  const array = Array(size).fill(null)
  return array.map((_, index) => ({
    state: getSegmentState(index, selection),
    position: getSegmentPosition(index, selection),
  }))
}

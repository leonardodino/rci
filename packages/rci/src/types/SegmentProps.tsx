import { SelectionState } from 'use-code-input'

type SegmentStateValue = 'cursor' | 'selected' | null
type SegmentPositionValue = -1 | 0 | 1

/** @public */
export type SegmentProps = {
  index: number
  state: SegmentStateValue
  position: SegmentPositionValue
  selection: SelectionState
}

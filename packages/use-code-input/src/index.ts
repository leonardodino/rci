import React, { useRef, useLayoutEffect, useState, useCallback } from 'react'
export type SelectionState = readonly [number, number]

type TransformInput = {
  current: Readonly<SelectionState>
  previous: Readonly<SelectionState>
  value: string
  direction: 'forward' | 'backward' | 'none' | null
}

// TODO: fix firefox direction
type Transform = (input: TransformInput) => [number, number] | null

const transform: Transform = ({ current, previous, value }) => {
  if (current[0] !== current[1]) return null
  if (typeof current[0] !== 'number') return null
  if (typeof current[1] !== 'number') return null

  const [start, end] = current

  if (start > 0 && previous[0] === start && previous[1] === start + 1) {
    return [start - 1, end]
  }

  if (value[start]?.length) {
    return [start, end + 1]
  }

  // TODO: add switch prop for this behaviour
  // if (eq(current, [input.maxLength, input.maxLength])) {
  //  return [input.maxLength -1, input.maxLength]
  // }

  return null
}

const getSelectionState = (input: HTMLInputElement): SelectionState => {
  return [+input.selectionStart!, +input.selectionEnd!]
}

const ZERO: SelectionState = [0, 0]
const eq = (a: SelectionState, b: SelectionState): boolean => {
  return a[0] === b[0] && a[1] === b[1]
}

const useCodeInputHandler = ({
  inputRef,
  previousRef,
  setSelection,
}: {
  inputRef: React.RefObject<HTMLInputElement>
  previousRef: React.MutableRefObject<SelectionState | undefined>
  setSelection: React.Dispatch<React.SetStateAction<SelectionState>>
}) => {
  return useCallback(
    ({ type }: { type: string }) => {
      const input = inputRef.current
      const previous = previousRef.current
      if (!previous || !input) return

      const { selectionDirection: direction, value } = input
      const current = getSelectionState(input)

      const save = (selection: SelectionState): void => {
        if (eq(selection, previous)) {
          if (eq(selection, ZERO)) return
          if (eq(selection, getSelectionState(input))) return
        }
        previousRef.current = selection
        setSelection((state) => (eq(state, selection) ? state : selection))
        input.setSelectionRange(...selection, direction || undefined)
      }

      if (type === 'selectionchange' && document.activeElement !== input) {
        return save([value.length, value.length] as const)
      }

      save(transform({ previous, current, direction, value }) || current)
    },
    [inputRef, previousRef, setSelection],
  )
}

const useCodeInputEffect = ({
  inputRef,
  previousRef,
  handler,
}: {
  inputRef: React.RefObject<HTMLInputElement>
  previousRef: React.MutableRefObject<SelectionState | undefined>
  handler: (event: Event) => void
}): void => {
  useLayoutEffect(() => {
    const input = inputRef.current

    if (previousRef.current === undefined && input) {
      previousRef.current = getSelectionState(input)
    }

    const handlerRef = handler // closure ref to added handler
    input?.addEventListener('input', handlerRef)
    document.addEventListener('selectionchange', handlerRef)
    return () => {
      input?.removeEventListener('input', handlerRef)
      document.removeEventListener('selectionchange', handlerRef)
    }
  }, [inputRef, handler, previousRef])
}

export const useCodeInput = (inputRef: React.RefObject<HTMLInputElement>) => {
  const [selection, setSelection] = useState<SelectionState>(ZERO)
  const previousRef = useRef<SelectionState>()
  const handler = useCodeInputHandler({ inputRef, previousRef, setSelection })

  useCodeInputEffect({ inputRef, previousRef, handler })

  return selection
}

import React, { useRef, useLayoutEffect, useState, useCallback } from 'react'
import { SelectionState } from './types'

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

  return null
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
      const current: SelectionState = [input.selectionStart, input.selectionEnd]

      const save = (selection: SelectionState): void => {
        if (selection[0] === previous[0] && selection[1] === previous[1]) {
          if (selection[0] === 0 && selection[1] === 0) return
          const DOM: SelectionState = [input.selectionStart, input.selectionEnd]
          if (selection[0] === DOM[0] && selection[1] === DOM[1]) return
        }
        previousRef.current = selection
        setSelection((state) => {
          if (state[0] !== selection[0]) return selection
          if (state[1] !== selection[1]) return selection
          return state
        })
        // @ts-ignore TODO: refactor SelectionState to be [number, number]
        input.setSelectionRange(...selection, direction)
      }

      if (type === 'selectionchange' && document.activeElement !== input) {
        return save([value.length, value.length] as const)
      }

      save(transform({ previous, current, direction, value }) || current)
    },
    [inputRef, previousRef, setSelection],
  )
}

const selectionChange = (handler: (event: Event) => void): (() => void) => {
  const type = 'selectionchange'
  if (navigator.userAgent.includes(' Firefox/')) {
    const interval = setInterval(handler, 16, { type })
    return () => clearInterval(interval)
  }
  document.addEventListener(type, handler)
  return () => document.removeEventListener(type, handler)
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
      previousRef.current = [input.selectionStart, input.selectionEnd]
    }

    const cleanupSelectionChange = selectionChange(handler)
    input?.addEventListener('input', handler)
    return () => {
      cleanupSelectionChange()
      input?.removeEventListener('input', handler)
    }
  }, [inputRef, handler, previousRef])
}

export const useCodeInput = (inputRef: React.RefObject<HTMLInputElement>) => {
  const [selection, setSelection] = useState<SelectionState>([0, 0])
  const previousRef = useRef<SelectionState>()
  const handler = useCodeInputHandler({
    inputRef,
    previousRef,
    setSelection,
  })

  useCodeInputEffect({ inputRef, previousRef, handler })

  return selection
}

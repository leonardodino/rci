import { useRef, useState } from 'react'
import { useIsFocused } from 'use-is-focused'
import { CodeInput, getSegmentCssWidth } from 'rci'

const checkCodeApiMock = (code: string, expected: string): Promise<boolean> => {
  return new Promise<boolean>((r) => setTimeout(r, 350, code === expected))
}

const classNames = (...strings: (string | null | undefined | false)[]) => {
  return strings.filter((string) => string).join(' ')
}

const redirectToAppMock = () => {
  alert('redirect to app')
  window.location.assign(window.location.href)
}

type CodeState = 'input' | 'loading' | 'error' | 'success'
type ExampleProps = { id: string; expected: string; autoFocus?: boolean }
export const Example = ({ id, expected, autoFocus }: ExampleProps) => {
  const [state, setState] = useState<CodeState>('input')
  const inputRef = useRef<HTMLInputElement>(null)
  const focused = useIsFocused(inputRef)

  const length = expected.length
  const padding = '10px'
  const width = getSegmentCssWidth(padding)
  const isError = state === 'error'
  const errorClassName = 'motion-safe:animate-[shake_0.15s_ease-in-out_0s_2]'

  return (
    <CodeInput
      id={id}
      className={isError ? errorClassName : ''}
      inputClassName='caret-transparent selection:bg-transparent'
      autoFocus={autoFocus}
      length={length}
      readOnly={state !== 'input'}
      disabled={state === 'loading'}
      inputRef={inputRef}
      padding={padding}
      spacing={padding}
      spellCheck={false}
      inputMode='numeric'
      pattern='[0-9]*'
      autoComplete='one-time-code'
      onChange={({ currentTarget: input }) => {
        // only accept numbers
        input.value = input.value.replace(/\D+/g, '')

        // auto submit on input fill
        if (input.value.length === length) {
          setState('loading')
          checkCodeApiMock(input.value, expected).then((success) => {
            if (success) {
              setState('success')
              return setTimeout(redirectToAppMock, 500)
            }
            setState('error')
            setTimeout(() => {
              setState('input')
              input.value = ''
              input.dispatchEvent(new Event('input'))
              input.focus()
            }, 500)
          })
        }
      }}
      renderSegment={(segment) => {
        const isCaret = focused && segment.state === 'cursor'
        const isSelection = focused && segment.state === 'selected'
        const isLoading = state === 'loading'
        const isSuccess = state === 'success'
        const isError = state === 'error'
        const isActive = isSuccess || isError || isSelection || isCaret

        const baseClassName =
          'flex h-full appearance-none rounded-md border-2 border-gray-300 bg-white [--segment-color:#6366f1] data-[state="error"]:[--segment-color:#ef4444] data-[state="success"]:[--segment-color:#10b981]'
        const activeClassName =
          'data-[state]:border-[var(--segment-color)] shadow-[var(--segment-color)_0_0_0_1px]'
        const loadingClassName =
          'animate-[pulse-border_1s_ease-in-out_0s_infinite]'

        const outerClassName = classNames(
          baseClassName,
          isActive && activeClassName,
          isLoading && loadingClassName,
        )

        const caretClassName =
          'flex-[0_0_2px] justify-self-center mx-auto my-2 w-0.5 bg-black animate-[blink-caret_1.2s_step-end_infinite]'
        const selectionClassName =
          'flex-1 m-[3px] rounded-sm bg-[var(--segment-color)] opacity-[0.15625]'

        const innerClassName = classNames(
          isSelection && selectionClassName,
          isCaret && caretClassName,
        )

        return (
          <div
            key={segment.index}
            data-state={state}
            className={outerClassName}
            style={{ width }}
            children={<div className={innerClassName} />}
          />
        )
      }}
    />
  )
}

import { useRef, useState } from 'react'

import { useIsFocused } from 'use-is-focused'
import { CodeInput, getSegmentCssWidth } from 'rci'

const checkCodeApiMock = (code: string, expected: string): Promise<boolean> => {
  return new Promise<boolean>((r) => setTimeout(r, 350, code === expected))
}

const redirectToAppMock = () => {
  alert('redirect to app')
  window.location.assign(window.location.href)
}

const getClassName = (
  base: string,
  { focused, state }: { focused: boolean | undefined; state: CodeState },
) => {
  return [base, focused && '-focused', `-state-${state}`]
    .filter((a) => a)
    .join(' ')
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

  return (
    <CodeInput
      id={id}
      className={getClassName('ExampleUsageCodeInput', { focused, state })}
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
              input.focus()
            }, 500)
          })
        }
      }}
      renderSegment={({ state, index }) => (
        <div
          key={index}
          className='segment'
          data-state={state}
          style={{ width, height: '100%' }}
          children={<div />}
        />
      )}
    />
  )
}

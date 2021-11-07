import 'modern-normalize'
import './index.css'

import { useRef } from 'react'
import { render } from 'react-dom'

import { useIsFocused } from 'use-is-focused'
import { CodeInput, getSegmentCssWidth } from 'rci'

const ExampleUsage = () => {
  const padding = '10px'
  const inputRef = useRef<HTMLInputElement>(null)
  const focused = useIsFocused(inputRef)
  const width = getSegmentCssWidth(padding)

  return (
    <CodeInput
      className={`ExampleUsageCodeInput ${focused ? '-focused' : ''}`}
      autoFocus
      inputRef={inputRef}
      padding={padding}
      spacing={padding}
      spellCheck={false}
      inputMode='numeric'
      pattern='[0-9]*'
      autoComplete='one-time-code'
      renderSegment={({ state, index }) => {
        return (
          <div
            key={index}
            className='segment'
            data-state={state}
            style={{ width, height: '100%' }}
          >
            <div />
          </div>
        )
      }}
    />
  )
}

render(<ExampleUsage />, document.getElementById('root'))

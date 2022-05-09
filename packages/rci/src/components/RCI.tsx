import React from 'react'
import { RenderSegmentFn } from '../types/RenderSegmentFn'

import { getSegmentArray } from '../utils/getSegmentArray'
import { useLengthContext, useSelectionContext } from './Context'

export { Context } from './Context'

export const Root = (props: React.ComponentPropsWithoutRef<'div'>) => (
  <div {...props} data-code-input='root' />
)

export const Absolute = (props: React.ComponentPropsWithoutRef<'div'>) => (
  <div
    {...props}
    data-code-input='absolute'
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'space-between',
      ...props.style,
    }}
  />
)

const handleScroll = (event: React.UIEvent) => {
  event.preventDefault()
  event.stopPropagation()
  event.currentTarget.scrollTop = 0
  event.currentTarget.scrollLeft = 0
}
type CodeInputInputScrollWrapperProps = React.ComponentProps<'div'>
export const InputScrollWrapper = (props: CodeInputInputScrollWrapperProps) => {
  return (
    <div
      {...props}
      data-code-input='input-scroll-wrapper'
      onScroll={handleScroll}
      style={{
        ...props.style,
        height: '100%',
        overflow: 'hidden',
      }}
    />
  )
}

type InputProps = Omit<
  React.ComponentPropsWithRef<'input'>,
  'maxLength' | 'children'
>
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const length = useLengthContext()
    return (
      <input
        {...props}
        width={undefined}
        data-code-input='input'
        minLength={length}
        maxLength={length}
        ref={ref}
        style={{
          ...props.style,
          font: 'inherit',
          letterSpacing: 'inherit',
          textIndent: 'inherit',
          background: 'transparent',
          appearance: 'none',
          display: 'block',
          width: props.width ?? '200%',
          padding: '0',
          margin: '0',
          border: '0 solid transparent',
          outline: 'none',
        }}
      />
    )
  },
)

export const SegmentRenderer = (props: { children: RenderSegmentFn }) => {
  const selection = useSelectionContext()
  const length = useLengthContext()
  // TODO: fix non-null assertion
  const _selection = selection!
  const segmentArray = getSegmentArray(length, _selection)

  const content = segmentArray.map(({ state, position }, index) => {
    return props.children({ index, state, position, selection: _selection })
  })

  return <>{content}</>
}

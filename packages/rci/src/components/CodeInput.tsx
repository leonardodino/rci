import React from 'react'
import { useCodeInput } from 'use-code-input'
import { RenderSegmentFn } from '../types/RenderSegmentFn'

import * as RCI from './RCI'

type InputProps = Omit<
  React.ComponentPropsWithRef<'input'>,
  'maxLength' | 'children'
>

export type CodeInputProps = InputProps & {
  inputRef: React.RefObject<HTMLInputElement>
  renderSegment: RenderSegmentFn

  length?: number

  fontFamily?: string
  fontSize?: string

  padding?: string
  paddingY?: string
  paddingX?: string
  spacing?: string

  /** advanced: for browsers which don't support "ch" unit */
  characterWidth?: string

  /** advanced: very few valid reasons to override this for CodeInput */
  segmentWidth?: string

  /** advanced: can be used if input needs to be larger (example: auto-fill buttons are overlapping input) */
  inputWidth?: string

  inputClassName?: InputProps['className']
  inputStyle?: InputProps['style']
}

export const CodeInput = ({
  renderSegment,
  length = 6,
  fontFamily = "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', monospace",
  fontSize = '2rem',
  padding = '0.25rem',
  paddingY = padding,
  paddingX = padding,
  spacing = '0.5rem',
  characterWidth = '1ch',
  style,
  className,
  inputClassName,
  inputStyle,
  segmentWidth = `calc(${characterWidth} + ${paddingX} * 2)`,
  inputWidth = `calc(100% + ${segmentWidth} + ${spacing})`,
  inputRef,
  ...rest
}: CodeInputProps) => {
  const selection = useCodeInput(inputRef)

  const rootStyle = {
    ...style,
    position: 'relative',
    width: `calc(${segmentWidth} * ${length} + ${spacing} * ${length - 1})`,
    fontFamily,
    fontSize,
    textIndent: paddingX,
    letterSpacing: `calc(${paddingX} * 2 + ${spacing})`,
    lineHeight: `calc(${fontSize} + ${paddingY} * 2)`,
    zIndex: 0,
  } as const

  const inputProps = {
    className: inputClassName,
    style: inputStyle,
    ref: inputRef,
  }

  return (
    <RCI.Context length={length} selection={selection}>
      <RCI.Root style={rootStyle} className={className}>
        <RCI.Absolute aria-hidden={true} style={{ zIndex: -1 }}>
          <RCI.SegmentRenderer children={renderSegment} />
        </RCI.Absolute>
        <RCI.InputScrollWrapper
          onMouseDownCapture={(event) => {
            if (event.button !== 0 || event.ctrlKey) return
            if (event.shiftKey || event.metaKey) return
            if (!(event.currentTarget instanceof HTMLElement)) return
            if (!(inputRef.current instanceof HTMLInputElement)) return
            event.stopPropagation()
            event.preventDefault()
            const { left, width } = event.currentTarget.getBoundingClientRect()
            const eventX = event.clientX - left
            const index = Math.floor((eventX / width) * length)
            if (document.activeElement !== inputRef.current) {
              inputRef.current?.focus()
            }
            inputRef.current?.setSelectionRange(index, index + 1)
          }}
          onDoubleClickCapture={() => {
            inputRef.current?.setSelectionRange(0, length)
          }}
        >
          <RCI.Input width={inputWidth} {...rest} {...inputProps} />
        </RCI.InputScrollWrapper>
      </RCI.Root>
    </RCI.Context>
  )
}

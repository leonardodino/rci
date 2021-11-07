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
  inputRef,
  ...rest
}: CodeInputProps) => {
  const selection = useCodeInput(inputRef)

  const segmentWidth = `calc(${characterWidth} + ${paddingX} * 2)`
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
        <RCI.Absolute style={{ zIndex: -1 }}>
          <RCI.SegmentRenderer children={renderSegment} />
        </RCI.Absolute>
        <RCI.InputScrollWrapper>
          <RCI.Input {...rest} {...inputProps} />
        </RCI.InputScrollWrapper>
      </RCI.Root>
    </RCI.Context>
  )
}

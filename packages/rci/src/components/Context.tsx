import React, { useContext } from 'react'
import { useCodeInput } from 'use-code-input'

type SelectionValue = ReturnType<typeof useCodeInput>

const LengthContext = React.createContext<number>(6)
export const useLengthContext = () => useContext(LengthContext)

const SelectionContext = React.createContext<SelectionValue | null>(null)
export const useSelectionContext = () => useContext(SelectionContext)

type ContextProps = {
  length: number
  selection: SelectionValue
  children?: React.ReactNode | undefined
}
export const Context = (props: ContextProps) => (
  <LengthContext.Provider value={props.length}>
    <SelectionContext.Provider value={props.selection}>
      {props.children}
    </SelectionContext.Provider>
  </LengthContext.Provider>
)

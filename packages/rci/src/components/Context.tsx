import React, { useContext } from 'react'
import { useCodeInput } from 'use-code-input'

type SelectionValue = ReturnType<typeof useCodeInput>

const LengthContext = React.createContext<number>(6)
export const useLengthContext = () => useContext(LengthContext)

const SelectionContext = React.createContext<SelectionValue | null>(null)
export const useSelectionContext = () => useContext(SelectionContext)

type ContextProps = { length: number; selection: SelectionValue }
export const Context: React.FC<ContextProps> = (props) => (
  <LengthContext.Provider value={props.length}>
    <SelectionContext.Provider value={props.selection}>
      {props.children}
    </SelectionContext.Provider>
  </LengthContext.Provider>
)

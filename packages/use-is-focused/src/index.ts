import React, { useEffect, useRef, useState } from 'react'

export const useIsFocused = (inputRef: React.RefObject<HTMLInputElement>) => {
  const [isFocused, setIsFocused] = useState<boolean | undefined>(undefined)
  const isFocusedRef = useRef<boolean | undefined>(isFocused)

  isFocusedRef.current = isFocused

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const onFocus = () => setIsFocused(true)
    const onBlur = () => setIsFocused(false)
    input.addEventListener('focus', onFocus)
    input.addEventListener('blur', onBlur)

    if (isFocusedRef.current === undefined)
      setIsFocused(document.activeElement === input)

    return () => {
      input.removeEventListener('focus', onFocus)
      input.removeEventListener('blur', onBlur)
    }
  }, [inputRef, setIsFocused])

  return isFocused
}
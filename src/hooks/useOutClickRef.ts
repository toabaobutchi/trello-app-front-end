import { clickOutsideTrigger } from '@utils/functions'
import { useEffect, useRef } from 'react'

/** New version of {@link useOutClick} hook */
export function useOutClickRef<TElement extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const ref = useRef<TElement>(null)

  useEffect(() => {
    const handleClickOutside = clickOutsideTrigger(ref, handler)

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [handler, ref])

  return ref
}

import { clickOutsideTrigger } from '@utils/functions'
import { useEffect } from 'react'

export default function useOutClick<TElement extends HTMLElement = HTMLElement>(
  ref: React.RefObject<TElement> | React.RefObject<TElement>[],
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const handleClickOutside = clickOutsideTrigger(ref, handler)

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [handler, ref])
}

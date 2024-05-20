import { useEffect, useState } from 'react'
type OutClickResult = {
  isOutClick: boolean
  clickedElement: HTMLElement | null
}
export default function useClickTracker(trackedElement: HTMLElement, excludesElements?: HTMLElement[]) {
  const [outClick, setOutClick] = useState<OutClickResult>({
    isOutClick: false,
    clickedElement: null
  })

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // reset tracker state
      let outClickResult: OutClickResult = {
        isOutClick: false,
        clickedElement: null
      }
      if (trackedElement && !trackedElement.contains(e.target as Node)) {
        let isClickOnExcludesElement = null
        if (excludesElements) {
          isClickOnExcludesElement = excludesElements?.find(exc => exc?.contains(e.target as HTMLElement))
        }
        if (!isClickOnExcludesElement) {
          outClickResult = {
            isOutClick: true,
            clickedElement: e.target as HTMLElement
          }
        }
      }
      setOutClick(outClickResult)
    }
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [trackedElement, excludesElements, outClick])

  return { outClick, setOutClick }
}

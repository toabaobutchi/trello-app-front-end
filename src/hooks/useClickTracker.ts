import { useEffect, useState } from 'react'
type OutClickResult = {
  isOutClick: boolean
  clickedElement: HTMLElement | null
}
export default function useClickTracker<TElement extends HTMLElement = HTMLElement>(
  trackedElement?: TElement | null,
  excludesElements?: HTMLElement[]
) {
  const [outClick, setOutClick] = useState<OutClickResult>({
    isOutClick: false,
    clickedElement: null
  })

  // call reset function after handle out click event
  const reset = () => {
    setOutClick({
      isOutClick: false,
      clickedElement: null
    })
  }

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

  return { outClick, reset }
}

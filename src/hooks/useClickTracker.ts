import { useEffect, useState } from 'react'
type OutClickResult = {
  isOutClick: boolean
  clickedElement: HTMLElement | null
}
export default function useClickTracker(trackedElement: HTMLElement) {
  const [outClick, setOutClick] = useState<OutClickResult>({
    isOutClick: true,
    clickedElement: null
  })

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (trackedElement && !trackedElement.contains(e.target as Node)) {
        setOutClick({
          isOutClick: true,
          clickedElement: e.target as HTMLElement
        })
      } else {
        setOutClick({
          isOutClick: false,
          clickedElement: null
        })
      }
    }
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [trackedElement, outClick])

  return { outClick, setOutClick }
}

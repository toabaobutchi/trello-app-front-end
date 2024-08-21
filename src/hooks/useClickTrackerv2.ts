import useClickTracker from '@hooks/useClickTracker'
import { useEffect, useRef } from 'react'

// type ClickTrackerResult = {
//   isOutClick: boolean
//   clickedElement: HTMLElement | null
// }
type ExcludeSelector = {
  useSelector: true
  selectors: string[]
}

type ExcludeElement = {
  useSelector: false
  elements: (HTMLElement | null)[]
}

// const initOutClickResult: ClickTrackerResult = {
//   isOutClick: false,
//   clickedElement: null
// }
/**
 * @version v2 of {@link useClickTracker}
 * @obsolete
 */
export default function useClickTracker_v2<TElement extends HTMLElement = HTMLElement>(
  trackedRef: React.RefObject<TElement>,
  handler?: () => void,
  excludes?: ExcludeSelector | ExcludeElement
) {
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // reset tracker state
      const trackedElement = trackedRef.current
      if (trackedElement && !trackedElement.contains(e.target as Node)) {
        let isClickOnExcludesElement = false

        if (excludes) {
          if (excludes.useSelector) {
            const selectors = excludes.selectors

            selectors.forEach(selector => {
              const element = document.querySelector(selector)
              if (element && element.contains(e.target as Node)) {
                isClickOnExcludesElement = true
                return
              }
            })
          } else {
            const elements = excludes.elements

            elements.forEach(element => {
              if (element?.contains(e.target as Node)) {
                isClickOnExcludesElement = true
                return
              }
            })
          }
        }
        // click bên ngoài phần tử đang xét và cũng không click vào phần tử ngoại lệ
        if (!isClickOnExcludesElement) {
          handler?.()
        }
      }
    }
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])
}

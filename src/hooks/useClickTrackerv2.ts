import useClickTracker from '@hooks/useClickTracker'
import { useEffect, useRef } from 'react'

type ClickTrackerResult = {
  isOutClick: boolean
  clickedElement: HTMLElement | null
}
type ExcludeSelector = {
  useSelector: true
  selectors: string[]
}

type ExcludeElement = {
  useSelector: false
  elements: (HTMLElement | null)[]
}

const initOutClickResult: ClickTrackerResult = {
  isOutClick: false,
  clickedElement: null
}
/**
 * @version v2 of {@link useClickTracker}
 */
export default function useClickTracker_v2<TElement extends HTMLElement = HTMLElement>(
  trackedElement?: TElement | null,
  excludes?: ExcludeSelector | ExcludeElement
) {
  const outClickResultRef = useRef(initOutClickResult)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // reset tracker state
      let outClickResult = initOutClickResult
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

        if (!isClickOnExcludesElement) {
          outClickResult = {
            isOutClick: true,
            clickedElement: e.target as HTMLElement
          }
        }
        outClickResultRef.current = outClickResult
      } else outClickResultRef.current = { ...initOutClickResult, clickedElement: e.target as HTMLElement }
    }
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [trackedElement])

  return outClickResultRef.current
}

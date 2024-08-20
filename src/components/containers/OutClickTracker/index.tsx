import { useEffect, useRef } from 'react'

type OutClickTrackerProps = {
  children: React.ReactNode
  onOutClick?: (clickedElement: HTMLElement) => void
  excludes?: string[] | HTMLElement[]
} & React.ComponentPropsWithoutRef<'div'>

function OutClickTracker({ children, onOutClick, excludes, ...props }: OutClickTrackerProps) {
  const outClickTrackerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // reset tracker state
      const trackedElement = outClickTrackerRef.current
      if (trackedElement && !trackedElement.contains(e.target as Node)) {
        let isClickOnExcludesElement = false
        let clickedElement = e.target as HTMLElement
        if (excludes && excludes.length > 0) {
          if (typeof excludes[0] === 'string') {
            const selectors = excludes as string[]

            selectors.forEach(selector => {
              const element = document.querySelector(selector)
              if (element && element.contains(e.target as Node)) {
                isClickOnExcludesElement = true
                clickedElement = e.target as HTMLElement
                return
              }
            })
          } else {
            const elements = excludes as HTMLElement[]

            elements.forEach(element => {
              if (element?.contains(e.target as Node)) {
                isClickOnExcludesElement = true
                clickedElement = e.target as HTMLElement
                return
              }
            })
          }
        }
        // click bên ngoài phần tử đang xét và cũng không click vào phần tử ngoại lệ
        if (!isClickOnExcludesElement) {
          onOutClick?.(clickedElement)
        }
      }
    }
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  return (
    <div ref={outClickTrackerRef} {...props}>
      {children}
    </div>
  )
}

export default OutClickTracker

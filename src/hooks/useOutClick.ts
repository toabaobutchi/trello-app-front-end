import { useEffect } from 'react'

function useOutClick(
  element: Element,
  handleOutsideClick: () => void
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (element && !element.contains(e.target as Node)) {
        handleOutsideClick()
      }
    }
    document.addEventListener('click', handler)

    return () => {
      document.removeEventListener('click', handler)
    }
  }, [element, handleOutsideClick])
}

export default useOutClick

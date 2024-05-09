import { useEffect } from 'react'

function useOutClick(
  element: Element,
  // eslint-disable-next-line no-unused-vars
  dispatch: (value?: boolean) => void
) {
  useEffect(() => {
    const handleCloseMenu = (e: MouseEvent) => {
      if (element && !element.contains(e.target as Node)) {
        dispatch(false)
      }
    }
    document.addEventListener('click', handleCloseMenu)

    return () => {
      document.removeEventListener('click', handleCloseMenu)
    }
  }, [element, dispatch])
}

export default useOutClick

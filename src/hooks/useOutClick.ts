import { useEffect } from 'react'

function useOutClick(
  element: Element,
  dispatch: React.Dispatch<React.SetStateAction<boolean>>
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

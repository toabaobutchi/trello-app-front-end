import { useEffect } from 'react'

function useOutClick(
  element: Element,
  dispatch: React.Dispatch<React.SetStateAction<boolean>>,
  excludes?: (HTMLElement | null)[]
) {
  useEffect(() => {
    const handleCloseMenu = (e: MouseEvent) => {
      if (element && !element.contains(e.target as Node) && !excludes?.includes(e.target as HTMLElement)) {
        let isClickOnExcludesElement = null; // không click trên phần tử ngoại lệ
        if(excludes) {
          isClickOnExcludesElement = excludes?.find(exc => exc?.contains(e.target as HTMLElement))
        }
        if(!isClickOnExcludesElement) {
          dispatch(false)
        }
      }
    }
    document.addEventListener('click', handleCloseMenu)

    return () => {
      document.removeEventListener('click', handleCloseMenu)
    }
  }, [element, dispatch, excludes])
}

export default useOutClick

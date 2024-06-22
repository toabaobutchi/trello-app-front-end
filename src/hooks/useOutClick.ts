import { useEffect } from 'react'


/**
 * @deprecated Use {@link useClickTracker} instead. `DropdownMenu` and `FixedMenu` still use this hook to detect outside clicking (and it seems to still be working properly), but if you want to detect click events out of your component, please use `useClickTracker` instead.
 */
function useOutClick(
  element: Element,
  dispatch: React.Dispatch<React.SetStateAction<boolean>>,
  excludes?: (HTMLElement | null)[]
) {
  useEffect(() => {
    const handleCloseMenu = (e: MouseEvent) => {
      if (element && !element.contains(e.target as Node)) {
        let isClickOnExcludesElement = null // không click trên phần tử ngoại lệ
        if (excludes) {
          isClickOnExcludesElement = excludes?.find((exc) => exc?.contains(e.target as HTMLElement))
        }
        if (!isClickOnExcludesElement) {
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

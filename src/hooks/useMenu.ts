import { useRef, useState } from 'react'

function useMenu<AnchorType = HTMLElement>() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<AnchorType | null>(null)
  const handleToggleMenu = () => {
    setOpen(!open)
  }
  const handleCloseMenu = () => {
    setOpen(false)
  }
  return {
    anchorRef,
    open,
    toggleMenu: handleToggleMenu,
    closeMenu: handleCloseMenu
  }
}

export default useMenu
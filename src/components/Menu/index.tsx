import { useEffect, useRef } from 'react'
import './Menu.scss'
import { isOutOfScreen } from '@utils/functions'
import useClickTracker_v2 from '@hooks/useClickTrackerv2'

type MenuProps = {
  anchorElement: HTMLElement | null
  open: boolean
  header?: React.ReactNode
  onClose?: () => void
} & React.ComponentProps<'div'>

/**@deprecated */
function Menu({ anchorElement, open, onClose = () => {}, header, ...props }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const position = {
    left: `${anchorElement?.offsetLeft ?? 0}px`,
    top: `${(anchorElement?.offsetTop ?? 0) + (anchorElement?.offsetHeight ?? 0)}px`
  }
  const handleClose = () => {
    if (open) {
      onClose()
    }
  }
  useClickTracker_v2(menuRef, handleClose, { elements: [anchorElement], useSelector: false })

  useEffect(() => {
    if (menuRef.current && open) {
      const isOutScreen = isOutOfScreen(menuRef.current as HTMLElement)
      if (isOutScreen.horizontal?.isOverflow) {
        menuRef.current.style.transform = `translateX(-${isOutScreen.horizontal.diff}px) scale(1)`
      }
    }
  }, [open])

  return (
    <>
      {open && (
        <div
          ref={menuRef}
          className={`menu menu-content-box-shadow anchor-menu${open ? ' open' : ''} ${props?.className ?? ''}`}
          style={{ position: 'fixed', ...position, ...props?.style }}
        >
          {header}
          <div className='menu-body'>{props?.children}</div>
        </div>
      )}
    </>
  )
}

export default Menu

import useClickTracker from '@hooks/useClickTracker'
import { useEffect, useRef } from 'react'
import './Menu.scss'
import { isOutOfScreen } from '@utils/functions'

type MenuProps = {
  anchorElement: HTMLElement | null
  open: boolean
  header?: React.ReactNode
  onClose?: () => void
} & React.ComponentProps<'div'>

function Menu({ anchorElement, open, onClose = () => {}, header, ...props }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const position = {
    left: `${anchorElement?.offsetLeft ?? 0}px`,
    top: `${(anchorElement?.offsetTop ?? 0) + (anchorElement?.offsetHeight ?? 0)}px`
  }
  const handleClose = () => {
    onClose()
  }
  const { outClick, reset } = useClickTracker(menuRef.current as HTMLElement, [anchorElement as HTMLElement])

  useEffect(() => {
    if (menuRef.current && open) {
      const isOutScreen = isOutOfScreen(menuRef.current as HTMLElement)
      if (isOutScreen.horizontal?.isOverflow) {
        menuRef.current.style.transform = `translateX(-${isOutScreen.horizontal.diff}px)`
      }
    }
  }, [open])

  useEffect(() => {
    if (outClick.isOutClick && open) {
      handleClose()
      reset()
    }
  })

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

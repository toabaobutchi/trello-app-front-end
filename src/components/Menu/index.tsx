import useClickTracker from '@hooks/useClickTracker'
import { useEffect, useRef } from 'react'
import './Menu.scss'

type MenuProps = {
  anchorElement: HTMLElement | null
  open: boolean
  header?: React.ReactNode
  // eslint-disable-next-line no-unused-vars
  onClose?: () => void
} & React.ComponentProps<'div'>

function Menu({ anchorElement, open, onClose = () => {}, header, ...props }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const position = {
    left: `${anchorElement?.offsetLeft}px`,
    top: `${(anchorElement?.offsetTop ?? 0) + (anchorElement?.offsetHeight ?? 0)}px`
  }
  const handleClose = () => {
    onClose()
  }
  const { outClick, reset } = useClickTracker(menuRef.current as HTMLElement, [anchorElement as HTMLElement])
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

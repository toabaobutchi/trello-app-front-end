import { useEffect, useRef } from 'react'
import './Menu.scss'
import useClickTracker from '@hooks/useClickTracker'

type MenuProps = {
  anchorElement: HTMLElement | null
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onClose?: (id: string) => void
} & React.ComponentProps<'div'>

function Menu({ anchorElement, open, onClose = () => {}, ...props }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const position = {
    left: `${anchorElement?.offsetLeft}px`,
    top: `${(anchorElement?.offsetTop ?? 0) + (anchorElement?.offsetHeight ?? 0)}px`
  }
  const handleClose = () => {
    onClose(anchorElement?.id ?? '')
  }
  const { outClick, setOutClick } = useClickTracker(menuRef.current as HTMLElement, [anchorElement as HTMLElement])
  useEffect(() => {
    if (outClick.isOutClick) {
      handleClose()

      // reset
      setOutClick({
        isOutClick: false,
        clickedElement: null
      })
    }
  })

  return (
    <>
      <div
        ref={menuRef}
        className={`menu menu-content-box-shadow anchor-menu${open ? ' open' : ''} ${props?.className ?? ''}`}
        style={{ position: 'fixed', ...position, ...props?.style }}
      >
        {props?.children}
      </div>
    </>
  )
}

export default Menu

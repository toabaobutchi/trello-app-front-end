import { useEffect, useRef } from 'react'
import './Menu.scss'
import useClickTracker from '@hooks/useClickTracker'
import { isOutClick } from '@utils/functions'

type MenuProps = {
  anchorElement: HTMLElement | null
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onClose?: (element: HTMLElement | null) => void
} & React.ComponentProps<'div'>

function Menu({ anchorElement, open, onClose = () => {}, ...props }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const position = {
    left: `${anchorElement?.offsetLeft}px`,
    top: `${(anchorElement?.offsetTop ?? 0) + (anchorElement?.offsetHeight ?? 0)}px`
  }
  const handleClose = () => {
    console.log(menuRef.current)
    onClose(anchorElement)
  }
  const { outClick, setOutClick } = useClickTracker(menuRef.current as HTMLElement)
  useEffect(() => {
    if (outClick.isOutClick && open) {
      if (isOutClick(anchorElement as HTMLElement, outClick.clickedElement)) {
        handleClose()
      }
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

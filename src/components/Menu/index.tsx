import { useRef } from 'react'
import './Menu.scss'
import useOutClick from '@hooks/useOutClick'

type MenuProps = {
  anchorElement: HTMLElement | null
  open: boolean
  onClose?: () => void
} & React.ComponentProps<'div'>

function Menu({ anchorElement, open, onClose = () => {}, ...props }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const position = {
    left: `${anchorElement?.offsetLeft}px`,
    top: `${(anchorElement?.offsetTop ?? 0) + (anchorElement?.offsetHeight ?? 0)}px`
  }
  useOutClick(menuRef.current as Element, onClose, [anchorElement])
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

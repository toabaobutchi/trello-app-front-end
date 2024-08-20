import { useEffect, useRef } from 'react'
import './Menu_v2.scss'
import { isOutOfScreen, outClickHandler } from '@utils/functions'

type MenuProps = {
  anchorId: string
  open: boolean
  header?: React.ReactNode
  onClose?: () => void
} & React.ComponentProps<'div'>

function Menu({ anchorId, open, onClose = () => {}, header, ...props }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const anchorElement = document.getElementById(anchorId)
  const position = {
    left: `${anchorElement?.offsetLeft ?? 0}px`,
    top: `${(anchorElement?.offsetTop ?? 0) + (anchorElement?.offsetHeight ?? 0)}px`
  }

  useEffect(() => {
    const handler = outClickHandler(menuRef.current, onClose, [`#${anchorId}`])
    document.addEventListener('click', handler)

    return () => {
      document.removeEventListener('click', handler)
    }
  }, [anchorId])

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
      <div
        ref={menuRef}
        className={`menu menu-content-box-shadow anchor-menu${open ? ' open' : ''} ${props?.className ?? ''}`}
        style={{ position: 'fixed', ...position, ...props?.style }}
      >
        {open && (
          <>
            {header}
            <div className='menu-body'>{props?.children}</div>
          </>
        )}
      </div>
    </>
  )
}

export default Menu

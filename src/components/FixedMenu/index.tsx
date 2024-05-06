import { useRef, useState } from 'react'
import './FixedMenu.scss'
import useOutClick from '@hooks/useOutClick'

interface FixedMenuTitleType {
  content: React.ReactNode
  style?: React.CSSProperties
  classes?: string
  customHtmlAttributes?: object
}

interface FixedMenuProps {
  children?: React.ReactNode
  side?: 'left' | 'right'
  title?: FixedMenuTitleType
  style?: React.CSSProperties
  height?: 'half' | 'full' | 'quarter'
  width?: string
}

function FixedMenu({
  children = '',
  side = 'left',
  title,
  style = {},
  height = 'full',
  width = '25%'
}: FixedMenuProps) {
  const [clicked, setClicked] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const handleToggleMenu = () => {
    setClicked(!clicked)
  }
  useOutClick(menuRef.current as Element, setClicked)
  return (
    <>
      <div ref={menuRef} className={`menu fixed-menu ${side}-menu h-${height}`}>
        <div
          className={`fixed-menu-title ${clicked && 'open'} ${title?.classes}`}
          onClick={handleToggleMenu}
          style={title?.style}
          {...title?.customHtmlAttributes}
        >
          {title?.content}
        </div>
        {clicked && (
          <div className='fixed-menu-content menu-content-box-shadow' style={{ '--fixed-menu-width': width, ...style } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </>
  )
}

export default FixedMenu

import { useRef, useState } from 'react'
import './FixedMenu.scss'
import useOutClick from '@hooks/useOutClick'
import CustomizablePropType from '@utils/CustomizablePropType'

interface FixedMenuProps {
  children?: React.ReactNode
  side?: 'left' | 'right'
  title?: CustomizablePropType
  style?: React.CSSProperties
  height?: 'half' | 'full' | 'quarter'
  width?: string
  layout?: {
    header?: CustomizablePropType
    footer?: CustomizablePropType
  }
}

function FixedMenu({
  children = '',
  side = 'left',
  title,
  style = {},
  height = 'full',
  width = '25%',
  layout = undefined
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
          className={`fixed-menu-title${clicked ? ' open': ''} ${title?.className ?? ''}`}
          onClick={handleToggleMenu}
          style={title?.style}
          {...title?.customHtmlAttributes}
        >
          {title?.content}
        </div>
        {clicked && (
          <div
            className={`fixed-menu-content menu-content-box-shadow ${layout?.header ? 'header-menu' : ''} ${
              layout?.footer ? 'footer-menu' : ''
            }`}
            style={{ '--fixed-menu-width': width, ...style } as React.CSSProperties}
          >
            {layout?.header?.content && (
              <div
                className={`fixed-menu-content-header ${layout?.header?.className ?? ''}`}
                style={layout?.header?.style}
                {...layout?.header?.customHtmlAttributes}
              >
                {layout?.header?.content}
              </div>
            )}
            <div className='fixed-menu-content-body'>{children}</div>
            {layout?.footer?.content && (
              <div
                className={`fixed-menu-content-footer ${layout?.footer?.className ?? ''}`}
                style={layout?.footer?.style}
                {...layout?.footer?.customHtmlAttributes}
              >
                {layout?.footer?.content}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default FixedMenu

import { CustomizablePropType } from '@utils/types'
import useOutClick from '@hooks/useOutClick_'
import { useRef, useState } from 'react'
import './DropdownMenu.scss'

interface DropdownMenuProps {
  children?: React.ReactNode
  title?: CustomizablePropType
  showOn?: 'click' | 'hover'
  useArrow?: React.ReactNode | false
  style?: React.CSSProperties
  dir?: 'ltr' | 'rtl'
  useCloseIcon?: boolean
  layout?: {
    header?: CustomizablePropType
    useScrollbar?: boolean
    footer?: CustomizablePropType
  }
}

function DropdownMenu({
  children = '',
  title = undefined,
  showOn = 'click',
  useArrow = <i className='fa-solid fa-chevron-down'></i>,
  style = {},
  dir = 'ltr',
  useCloseIcon = false,
  layout = undefined
}: DropdownMenuProps) {
  const [clicked, setClicked] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleToggleMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setClicked(!clicked)
  }

  // dành cho việc ấn nút đóng menu
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // trường hợp menu lồng nhau thì chỉ tắt menu hiện tại
    setClicked(false)
  }

  useOutClick(menuRef.current as Element, setClicked)
  return (
    <>
      <div ref={menuRef} className={`menu dropdown-menu ${showOn}-menu ${dir}-menu`}>
        <div
          className={`dropdown-menu-title${clicked ? ' open' : ''} ${title?.className ?? ''}`}
          onClick={handleToggleMenu}
          {...title?.customHtmlAttributes}
          style={title?.style}
        >
          {title?.content}
          {useArrow && <span>&nbsp;&nbsp;</span>}
          {useArrow}
        </div>
        {clicked && (
          <div
            className={`dropdown-menu-content menu-content-box-shadow ${layout?.header ? 'header-menu' : ''} ${
              layout?.footer ? 'footer-menu' : ''
            }`}
            style={style}
          >
            {useCloseIcon && (
              <div className='dropdown-menu-content-close-icon' onClick={handleClose}>
                <i className='fa-solid fa-xmark'></i>
              </div>
            )}
            {layout?.header?.content && (
              <div
                className={`dropdown-menu-content-header ${layout?.header?.className ?? ''}`}
                style={layout?.header?.style}
                {...layout?.header?.customHtmlAttributes}
              >
                {layout?.header?.content}
              </div>
            )}
            <div className={`dropdown-menu-content-body ${layout?.useScrollbar ? 'overflow-y-body' : ''}`}>
              {children}
            </div>
            {layout?.footer && (
              <div
                className={`dropdown-menu-content-footer ${layout?.footer?.className ?? ''}`}
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

export default DropdownMenu

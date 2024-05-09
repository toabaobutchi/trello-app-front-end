import CustomizablePropType from '@utils/CustomizablePropType'
import useOutClick from '@hooks/useOutClick'
import { useRef, useState } from 'react'
import './DropdownMenu.scss'

interface DropdownMenuProps {
  children?: React.ReactNode
  showOn?: 'click' | 'hover'
  useArrow?: React.ReactNode | false
  style?: React.CSSProperties
  dir?: 'ltr' | 'rtl'
  useCloseIcon?: boolean
  layout?: {
    header?: CustomizablePropType
    useScrollbar?: boolean
    footer?: CustomizablePropType
  },
  // eslint-disable-next-line no-unused-vars
  handleToggleMenu?: (value?: boolean) => void
}

function DropdownMenu({
  children = '',
  showOn = 'click',
  style = {},
  dir = 'ltr',
  useCloseIcon = false,
  layout = undefined,
  handleToggleMenu = () => {}
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // dành cho việc ấn nút đóng menu
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // trường hợp menu lồng nhau thì chỉ tắt menu hiện tại
    handleToggleMenu()
  }

  useOutClick(menuRef.current as Element, handleToggleMenu)
  return (
    <>
      <div ref={menuRef} className={`menu dropdown-menu ${showOn}-menu ${dir}-menu`}>
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
                className={`dropdown-menu-content-header ${layout?.header?.classes ?? ''}`}
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
                className={`dropdown-menu-content-footer ${layout?.footer?.classes ?? ''}`}
                style={layout?.footer?.style}
                {...layout?.footer?.customHtmlAttributes}
              >
                {layout?.footer?.content}
              </div>
            )}
          </div>
        
      </div>
    </>
  )
}

export default DropdownMenu

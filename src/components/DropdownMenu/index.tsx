import { useRef, useState } from 'react'
import './DropdownMenu.scss'
import useOutClick from '@hooks/useOutClick'

interface DropdownMenuTitleType {
  content: React.ReactNode
  style?: React.CSSProperties
  classes?: string
  customHtmlAttributes?: object
}

interface DropdownMenuProps {
  children?: React.ReactNode
  title?: DropdownMenuTitleType
  showOn?: 'click' | 'hover'
  useArrow?: React.ReactNode | false
  style?: React.CSSProperties
  dir?: 'ltr' | 'rtl'
  useCloseIcon?: boolean
  header?: React.ReactNode
}

function DropdownMenu({
  children = '',
  title = undefined,
  showOn = 'click',
  useArrow = <i className='fa-solid fa-chevron-down'></i>,
  style = {},
  dir = 'ltr',
  useCloseIcon = false,
  header = null
}: DropdownMenuProps) {
  const [clicked, setClicked] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleToggleMenu = () => {
    setClicked(!clicked)
  }

  // dành cho việc ấn nút đóng menu
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // trường hợp menu lồng nhau thì chỉ tắt menu hiện tại
    handleToggleMenu()
  }

  useOutClick(menuRef.current as Element, setClicked)
  return (
    <>
      <div ref={menuRef} className={`menu dropdown-menu ${showOn}-menu ${dir}-menu`}>
        <div
          className={`dropdown-menu-title${clicked ? ' open' : ''} ${title?.classes}`}
          onClick={handleToggleMenu}
          {...title?.customHtmlAttributes}
          style={title?.style}
        >
          {title?.content}
          {useArrow && <span>&nbsp;&nbsp;</span>}
          {useArrow}
        </div>
        {clicked && (
          <div className='dropdown-menu-content menu-content-box-shadow' style={style}>
            {(header || useCloseIcon) && (
              <div className='dropdown-menu-content-header'>
                <div className='dropdown-menu-content-header-text'>{header}</div>
                {useCloseIcon && (
                  <div className='dropdown-menu-content-header-close-icon' onClick={handleClose}>
                    <i className='fa-solid fa-xmark'></i>
                  </div>
                )}
              </div>
            )}
            {children}
          </div>
        )}
      </div>
    </>
  )
}

export default DropdownMenu

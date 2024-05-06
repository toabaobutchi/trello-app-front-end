import React, { useState } from 'react'
import './MenuGroup.scss'

interface MenuGroupProps {
  title?: string
  children?: React.ReactNode
  divisor?: boolean
}

function MenuGroup({ title = '', children = '', divisor = false }: MenuGroupProps) {
  const [collapse, setColapse] = useState(true)
  const handleCollapse = () => {
    setColapse(!collapse)
  }
  return (
    <>
      <div className={`menu-group ${divisor ? 'divisor' : ''}`}>
        <div className='menu-group-title'>
          <p>
            {title} {!collapse && <span>({React.Children.count(children)})</span>}
          </p>
          <div className={`menu-group-title__close ${!collapse && 'hide'}`} onClick={handleCollapse}>
            <i className='fa-solid fa-chevron-down'></i>
          </div>
        </div>
        <div className='menu-group-content'>{collapse && children}</div>
      </div>
    </>
  )
}

export default MenuGroup

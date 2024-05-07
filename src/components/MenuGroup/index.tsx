import React, { useState } from 'react'
import './MenuGroup.scss'
import CustomizablePropType from '@utils/CustomizablePropType'

interface MenuGroupProps {
  title?: CustomizablePropType
  children?: React.ReactNode
  divisor?: boolean
}

function MenuGroup({ title = undefined, children = '', divisor = false }: MenuGroupProps) {
  const [collapse, setColapse] = useState(true)
  const handleCollapse = () => {
    setColapse(!collapse)
  }
  return (
    <>
      <div className={`menu-group ${divisor ? 'divisor' : ''}`}>
        <div className={`menu-group-title ${title?.classes ?? ''}`} style={title?.style}>
          <p>
            {title?.content} {!collapse && <span>({React.Children.count(children)})</span>}
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

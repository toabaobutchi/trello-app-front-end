import React, { useState } from 'react'
import './MenuGroup.scss'
import CustomizablePropType from '@utils/CustomizablePropType'

interface MenuGroupProps {
  title?: CustomizablePropType
  children?: React.ReactNode
  divisor?: boolean
  expandGroup?: boolean | null
}

function MenuGroup({ title = undefined, children = '', divisor = false, expandGroup = true }: MenuGroupProps) {
  const [collapse, setColapse] = useState(expandGroup !== null ? expandGroup : true);
  const handleCollapse = () => {
    setColapse(!collapse)
  }
  return (
    <>
      <div className={`menu-group ${divisor ? 'divisor' : ''}`}>
        <div className={`menu-group-title ${title?.className ?? ''}`} style={title?.style}>
          <p>
            {title?.content} {!collapse && expandGroup !== null && <span>({React.Children.count(children)})</span>}
          </p>
          {expandGroup !== null && (
            <div className={`menu-group-title__close ${!collapse && 'hide'}`} onClick={handleCollapse}>
              <i className='fa-solid fa-chevron-up'></i>
            </div>
          )}
        </div>
        <div className='menu-group-content'>{collapse && children}</div>
      </div>
    </>
  )
}

export default MenuGroup

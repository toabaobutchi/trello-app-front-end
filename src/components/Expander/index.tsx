import { useState } from 'react'
import './Expander.scss'
import CustomizablePropType from '@utils/CustomizablePropType'

interface ExpanderProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  header?: CustomizablePropType
  defaultExpand?: boolean
}

function Expander({ children = '', header, defaultExpand = false, ...props }: ExpanderProps) {
  const [expanded, setExpanded] = useState(defaultExpand)
  const handleToggleExpanded = () => {
    setExpanded(!expanded)
  }
  return (
    <>
      <div className='expander-header' onClick={handleToggleExpanded}>
        <div style={header?.style} className={`expander-header-text ${header?.className ?? ''}`.trimEnd()}>{header?.content}</div>
        <div className={`expander-header-icon${expanded ? ' expanded' : ''}`}>
          <i className='fa-solid fa-chevron-up expander-icon'></i>
          <i className='fa-solid fa-chevron-down expander-icon'></i>
        </div>
      </div>
      <div
        className={`expander-content ${expanded ? 'expanded' : ''} ${props?.className ?? ''}`.trimEnd()}
        style={props?.style}
      >
        {children}
      </div>
    </>
  )
}

export default Expander

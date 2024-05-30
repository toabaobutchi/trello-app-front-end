import { useState } from 'react'
import './Expander.scss'

interface ExpanderProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  header?: React.ReactNode
  defaultExpand?: boolean
}

function Expander({ children = '', header = '', defaultExpand = false, ...props }: ExpanderProps) {
  const [expanded, setExpanded] = useState(defaultExpand)
  const handleToggleExpanded = () => {
    setExpanded(!expanded)
  }
  return (
    <>
      <div className='expander-header' onClick={handleToggleExpanded}>
        <div className='expander-header-text'>{header}</div>
        <div className={`expander-header-icon ${expanded ? 'expanded' : ''}`.trimEnd()}>
          <i className='fa-solid fa-chevron-down'></i>
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

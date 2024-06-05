import { useState } from 'react'
import './Expander.scss'
import CustomizablePropType from '@utils/CustomizablePropType'

interface ExpanderProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  header?: CustomizablePropType
  defaultExpand?: boolean
  useArrow?: boolean
  onExpand?: (expanded: boolean) => void
}

function Expander({
  children = '',
  header,
  useArrow = true,
  defaultExpand = false,
  onExpand = () => {},
  ...props
}: ExpanderProps) {
  const [expanded, setExpanded] = useState(defaultExpand)
  const handleToggleExpanded = () => {
    setExpanded(!expanded)
    onExpand(!expanded)
  }
  return (
    <>
      <div className={`expander-header`} onClick={handleToggleExpanded}>
        <div style={header?.style} className={`expander-header-text ${header?.className ?? ''}`.trimEnd()}>
          {header?.content}
        </div>
        {useArrow && (
          <div className={`expander-header-icon${expanded ? ' expanded' : ''}`}>
            <i className='fa-solid fa-chevron-up expander-icon'></i>
            <i className='fa-solid fa-chevron-down expander-icon'></i>
          </div>
        )}
      </div>
      {expanded && (
        <div className={`expander-content ${props?.className ?? ''}`.trimEnd()} style={props?.style}>
          {children}
        </div>
      )}
    </>
  )
}

export default Expander

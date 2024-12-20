import { NavLink } from 'react-router-dom'
import './SideBarItem.scss'

function SideBarItem({ children = '', ...props }: React.ComponentProps<'div'>) {
  return (
    <>
      <div className={`sidebar-item ${props?.className ?? ''}`.trimEnd()} style={props?.style}>
        <div className='sidebar-item-content'>{children}</div>
      </div>
    </>
  )
}

function Link({
  to,
  activeClassname = 'active',
  children,
  onClick = () => {}
}: {
  to: string
  activeClassname?: string
  children?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <>
      <NavLink
        onClick={onClick}
        to={to}
        className={({ isActive }) => (isActive ? activeClassname : '') + ' sidebar-item'}
      >
        {children}
      </NavLink>
    </>
  )
}

SideBarItem.Link = Link

export default SideBarItem

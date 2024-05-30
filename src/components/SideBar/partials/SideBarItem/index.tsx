import './SideBarItem.scss'

interface SideBarItemProps extends React.ComponentProps<'div'> {
  children: React.ReactNode
  icon?: React.ReactNode
}

function SideBarItem({children = '', icon, ...props}: SideBarItemProps) {
  return <>
    <div className={`sidebar-item ${props?.className ?? ''}`.trimEnd()} style={props?.style}>
      {icon && <div className="sidebar-item-icon">{icon}</div>}
      <div className="sidebar-item-content">
        {children}
      </div>
    </div>
  </>
}

export default SideBarItem;
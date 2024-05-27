import './MenuHeaderWithAction.scss'

interface MenuHeaderWithActionProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  beforeButton?: React.ReactNode
  afterButton?: React.ReactNode
}

function MenuHeaderWithAction({ children = '', beforeButton, afterButton, ...props }: MenuHeaderWithActionProps) {
  return (
    <>
      <div className='menu-header-with-action'>
        {beforeButton && <div className='menu-header-before-btn'>{beforeButton}</div>}
        <div className='menu-header-content'>{children}</div>
        {afterButton && <div className='menu-header-after-btn'>{afterButton}</div>}
      </div>
    </>
  )
}

export default MenuHeaderWithAction

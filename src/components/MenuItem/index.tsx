import './MenuItem.scss'

interface MenuItemProps {
  onClick?: () => void
  children?: React.ReactNode
}
function MenuItem({ children = '', onClick = () => {} }: MenuItemProps) {
  const handleClick = () => {
    onClick()
  }
  return (
    <>
      <div className='menu-item' onClick={handleClick}>
        {children}
      </div>
    </>
  )
}

export default MenuItem

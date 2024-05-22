import './MenuItem.scss'

interface MenuItemProps extends React.ComponentProps<'div'> {
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}
function MenuItem({ children = '', onClick = () => {}, size = 'medium', ...props }: MenuItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick(e)
  }
  return (
    <>
      <div className={`menu-item menu-item-${size}`} onClick={handleClick} {...props}>
        {children}
      </div>
    </>
  )
}

export default MenuItem

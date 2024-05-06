import './MenuHeader.scss'

interface MenuHeaderProps {
    children?: React.ReactNode
}

function MenuHeader({children = ''}: MenuHeaderProps) {
  return (
    <>
      <div className='menu-header row jcsb'>
        {children}
      </div>
    </>
  )
}

export default MenuHeader

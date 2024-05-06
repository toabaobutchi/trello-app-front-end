import './MenuFooter.scss'

interface MenuFooterProps {
  children?: React.ReactNode
  style?: React.CSSProperties
}

function MenuFooter({ children = '', style = {} }: MenuFooterProps) {
  return (
    <>
      <div className={`menu-footer`} style={style}>
        {children}
      </div>
    </>
  )
}

export default MenuFooter

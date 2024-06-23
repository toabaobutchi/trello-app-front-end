import './ButtonGroup.scss'

type ButtonGroupProps = {
  children?: React.ReactNode
  actionButton?: React.ReactNode
  openAction?: boolean
}

function ButtonGroup({ children, actionButton, openAction = false }: ButtonGroupProps) {
  return (
    <>
      <div className={`button-group${openAction ? ' open-action' : ''}`}>
        <div className='button-group__main-button'>{children}</div>
        {openAction && <div className='button-group__action-button'>{actionButton}</div>}
      </div>
    </>
  )
}

export default ButtonGroup

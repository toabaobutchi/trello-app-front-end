import './Button.scss'

interface ButtonProps {
  variant?: 'filled' | 'outlined'
  disabled?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
  attributes?: React.ComponentPropsWithoutRef<'button'>,
  theme?: 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'light' | 'dark'
  onClick?: () => void,
  classes?: string
}

function Button({
  variant = 'outlined',
  disabled = false,
  children = '',
  style = {},
  attributes = {},
  onClick = () => {},
  theme = 'primary', classes = ''
}: ButtonProps) {
  const handleClick = () => {
    onClick()
  }
  return (
    <>
      <button
        className={`btn ${variant}-btn ${theme}-btn ${classes}`}
        style={style}
        {...attributes}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  )
}

export default Button

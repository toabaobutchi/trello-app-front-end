import './Button.scss'

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'text' | 'filled' | 'outlined'
  disabled?: boolean
  children?: React.ReactNode
  theme?: 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'light' | 'dark' | 'default'
  size?: 'small' | 'medium' | 'large'
}

function Button({
  variant = 'outlined',
  disabled = false,
  children = '',
  theme = 'primary',
  size = 'medium',
  ...props
}: ButtonProps) {
  const { style = {}, className = '', onClick = () => {}, ...buttonProps } = props
  return (
    <>
      <button
        onClick={onClick}
        className={`btn ${variant}-btn ${theme}-btn ${size}-btn ${className}`}
        style={style}
        disabled={disabled}
        {...buttonProps}
      >
        {children}
      </button>
    </>
  )
}

export default Button

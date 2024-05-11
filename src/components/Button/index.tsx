import './Button.scss'

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'text' | 'filled' | 'outlined'
  disabled?: boolean
  children?: React.ReactNode
  theme?: 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'light' | 'dark' | 'default'
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  size?: 'small' | 'medium' | 'large'
}

function Button({
  variant = 'outlined',
  disabled = false,
  children = '',
  // eslint-disable-next-line no-unused-vars
  onClick = (e: React.MouseEvent<HTMLElement>) => {},
  theme = 'primary',
  size = 'medium',
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick(e)
  }
  const { style = {}, className = '', ...buttonProps } = props
  return (
    <>
      <button
        className={`btn ${variant}-btn ${theme}-btn ${size}-btn ${className}`}
        style={style}
        onClick={handleClick}
        disabled={disabled}
        {...buttonProps}
      >
        {children}
      </button>
    </>
  )
}

export default Button

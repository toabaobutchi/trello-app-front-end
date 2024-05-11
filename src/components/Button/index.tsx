import './Button.scss'

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'text' | 'filled' | 'outlined'
  disabled?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
  attributes?: React.ComponentPropsWithoutRef<'button'>
  theme?: 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'light' | 'dark' | 'default'
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  classes?: string
  size?: 'small' | 'medium' | 'large'
}

function Button({
  variant = 'outlined',
  disabled = false,
  children = '',
  style = {},
  attributes = {},
  // eslint-disable-next-line no-unused-vars
  onClick = (e: React.MouseEvent<HTMLElement>) => {},
  theme = 'primary',
  classes = '',
  size = 'medium',
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick(e)
  }

  return (
    <>
      <button
        className={`btn ${variant}-btn ${theme}-btn ${size}-btn ${classes}`}
        style={style}
        {...attributes}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </>
  )
}

export default Button

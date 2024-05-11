import './Button.scss'

interface ButtonProps {
  variant?: 'text' | 'filled' | 'outlined'
  disabled?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
  attributes?: React.ComponentPropsWithoutRef<'button'>
  theme?: 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'light' | 'dark'
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
  onClick = (e: React.MouseEvent<HTMLElement>) => {},
  theme = 'primary',
  classes = '',
  size = 'medium'
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
      >
        {children}
      </button>
    </>
  )
}

export default Button

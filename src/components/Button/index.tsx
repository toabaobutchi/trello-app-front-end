import { ThemeType } from '@utils/types'
import './Button.scss'
import { forwardRef } from 'react'

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: 'text' | 'filled' | 'outlined'
  disabled?: boolean
  children?: React.ReactNode
  theme?: ThemeType
  size?: 'small' | 'medium' | 'large'
}

const Button = forwardRef((props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const {
    variant = 'outlined',
    disabled = false,
    children = '',
    theme = 'primary',
    size = 'medium',
    style = {},
    className = '',
    onClick = () => {},
    ...buttonProps
  } = props
  return (
    <>
      <button ref={ref}
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
})

export default Button

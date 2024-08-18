import './Button.scss'
import { forwardRef } from 'react'
import { Size, Theme, Variant } from '@utils/types/theme.type'

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
  variant?: Variant
  children?: React.ReactNode
  theme?: Theme
  size?: Size
}

const Button = forwardRef((props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const {
    variant = 'outlined',
    children = '',
    theme = 'primary',
    size = 'medium',
    style = {},
    className = '',
    ...buttonProps
  } = props

  return (
    <button
      ref={ref}
      className={`btn btn__${variant} btn__${theme} btn__${size}${className ? ' ' + className : ''}`}
      style={style}
      {...buttonProps}
    >
      {children}
    </button>
  )
})

export default Button

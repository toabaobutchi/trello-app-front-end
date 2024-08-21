import { Theme } from '@utils/types/theme.type'
import './IconButton.scss'

type IconButtonProps = {
  size?: 'small' | 'medium' | 'large'
  shape?: 'square' | 'circle'
  children: React.ReactNode
  theme?: Theme
  dashedBorder?: boolean
  blurWhenNotHover?: boolean
} & React.ComponentProps<'button'>

function IconButton({
  size = 'medium',
  children,
  theme = 'primary',
  shape = 'circle',
  dashedBorder = false,
  blurWhenNotHover = false,
  ...props
}: IconButtonProps) {
  return (
    <>
      <button
        {...props}
        className={`icon-button${
          props?.className ? ' ' + props?.className : ''
        } icon-button__${size} icon-button__${theme} icon-button__${shape} ${
          dashedBorder ? 'icon-button__dashed-border' : ''
        }${blurWhenNotHover ? ' icon-button__blur' : ''}`}
      >
        {children}
      </button>
    </>
  )
}

export default IconButton

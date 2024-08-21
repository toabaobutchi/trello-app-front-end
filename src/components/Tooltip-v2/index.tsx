import { ThemeType } from '@utils/types'
import './Tooltip.v2.scss'

type TooltipProps = {
  children?: React.ReactNode
  content?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  arrow?: boolean
  theme?: ThemeType
  delay?: string
} & React.ComponentProps<'div'>

function Tooltip({
  children = '',
  content,
  position = 'top',
  arrow = false,
  theme = 'dark',
  delay,
  ...props
}: TooltipProps) {
  if (!content) return children
  return (
    <>
      <div
        style={
          {
            '--tooltip-delay': delay,
            ...props.style
          } as React.CSSProperties
        }
        className={`tooltip-container ${position}-tooltip ${arrow ? ' arrow-tooltip' : ''} tooltip__${theme}${
          props?.className ? ' ' + props?.className : ''
        }`}
        data-tooltip-content={content}
      >
        {children}
      </div>
    </>
  )
}

export default Tooltip

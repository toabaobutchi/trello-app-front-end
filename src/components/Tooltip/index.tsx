import './Tooltip.scss'

interface TooltipProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  content?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  open?: boolean
  arrow?: boolean
  theme?: 'light' | 'dark' | 'gray' | string
  distance?: string
}

function Tooltip({
  children = '',
  content = '',
  position = 'bottom',
  trigger = 'hover',
  open,
  arrow = false,
  theme = 'dark',
  distance,
  ...props
}: TooltipProps) {
  let style = { ...props?.style }
  if (distance) style = { ['--tooltip-gap']: distance, ...props?.style } as React.CSSProperties
  return (
    <>
      <div className='tooltip'>
        <div className='tooltip-agent'>{children}</div>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          {...props}
          className={`tooltip-content${open ? ' open' : ''}${
            arrow ? ' arrow-tooltip' : ''
          } tooltip-content-${position} tooltip-content-${theme} tooltip-content-on-${trigger}${
            props?.className ? ' ' + props?.className : ''
          }
          }`}
          style={style}
        ></div>
      </div>
    </>
  )
}

export default Tooltip

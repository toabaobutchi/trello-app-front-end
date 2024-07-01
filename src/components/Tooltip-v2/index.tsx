import './Tooltip.v2.scss'

type TooltipProps = {
  children?: React.ReactNode
  content?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  arrow?: boolean
  theme?: 'light' | 'primary' | 'dark' | 'secondary' | 'info' | 'danger' | 'warning'
  delay?: string
}

function Tooltip({
  children = '',
  content = '',
  position = 'top',
  arrow = false,
  theme = 'dark',
  delay
}: TooltipProps) {
  return (
    <>
      <div
        style={
          {
            '--tooltip-delay': delay
          } as React.CSSProperties
        }
        className={`tooltip-container ${position}-tooltip ${arrow ? ' arrow-tooltip' : ''} ${theme}-tooltip`}
        data-tooltip-content={content}
      >
        {children}
      </div>
    </>
  )
}

export default Tooltip

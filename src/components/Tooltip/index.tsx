import { useEffect, useRef, useState } from 'react'
import './Tooltip.scss'
import styled from 'styled-components'

interface TooltipProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  content?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  open?: boolean
  arrow?: boolean
  theme?: 'light' | 'dark' | 'gray' | string
  distance?: string
  delay?: number
  maintainWhenHoverOn?: boolean
  events?: {
    triggerOnHover?: boolean
    onOpen?: () => void
    onClose?: () => void
  }
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
  delay,
  events,
  maintainWhenHoverOn,
  ...props
}: TooltipProps) {
  const tooltipAgentRef = useRef<HTMLDivElement | null>(null)
  const [eventState] = useState<typeof events>(events)

  let style = { ...props?.style }
  if (distance) style = { ['--tooltip-distance']: distance, ...style } as React.CSSProperties
  if (delay) style = { ['--tooltip-delay']: delay + 's', ...style } as React.CSSProperties

  useEffect(() => {
    const handle = {
      toggleTooltip: (e: MouseEvent) => {
        if (e.target instanceof Element && trigger === 'click') {
          e.target.nextElementSibling?.classList.toggle('open')
        }
      },
      open(e: MouseEvent) {
        if (trigger === 'click' || eventState?.triggerOnHover) eventState?.onOpen?.()
        this.toggleTooltip(e)
      },
      close(e: MouseEvent) {
        if (trigger === 'click' || eventState?.triggerOnHover) eventState?.onClose?.()
        this.toggleTooltip(e)
      }
    }

    const tooltipAgent = tooltipAgentRef.current

    const open = handle.open.bind(handle)
    const close = handle.close.bind(handle)

    if (tooltipAgent && eventState) {
      if (trigger === 'click') tooltipAgent.addEventListener('click', open)
      if (eventState?.triggerOnHover) {
        tooltipAgent.addEventListener('mouseenter', open)
        tooltipAgent.addEventListener('mouseleave', close)
      }
    }

    return () => {
      if (tooltipAgent && eventState) {
        if (trigger === 'click') tooltipAgent?.removeEventListener('click', open)
        if (eventState?.triggerOnHover) {
          tooltipAgent?.removeEventListener('mouseenter', open)
          tooltipAgent?.removeEventListener('mouseleave', close)
        }
      }
    }
  }, [eventState, trigger])
  return (
    <>
      <div className='tooltip'>
        <div className='tooltip-agent' ref={tooltipAgentRef}>
          {children}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          {...props}
          className={`tooltip-content${open ? ' open' : ''}${
            arrow ? ' arrow-tooltip' : ''
          } tooltip-content-${position} tooltip-content-${theme} tooltip-content-on-${trigger}${
            props?.className ? ' ' + props?.className : ''
          }${maintainWhenHoverOn ? ' maintain-on-hover' : ''}`}
          style={style}
        ></div>
      </div>
    </>
  )
}

Tooltip.Text = styled.p<{ $textDecoration?: string }>`
  text-decoration: ${props =>
    props.$textDecoration ? props.$textDecoration : 'underline dotted var(--secondary-color)'};
`

export default Tooltip

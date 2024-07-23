import Button from '@comps/Button'
import './Modal.scss'
import { CustomizablePropType } from '@utils/types'
import { useEffect, useId } from 'react'

interface ModalProps extends React.ComponentProps<'div'> {
  open?: boolean
  layout?: {
    theme?: 'error' | 'success' | 'warning' | 'info' | 'default'
    header?: {
      title?: React.ReactNode
      closeIcon?: boolean
    }
    footer?: React.ReactNode
    overlay?: CustomizablePropType
  }
  children?: React.ReactNode
  onClose?: () => void
}

function Modal({ open = false, layout = undefined, children = '', onClose = () => {}, ...props }: ModalProps) {
  const handleStopPropagation = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()
  return (
    <>
      {open && (
        <div
          className={`modal${layout?.theme ? ' ' + layout.theme + '-modal' : ' default-modal'}`}
          onClick={handleStopPropagation}
        >
          <div className='overlay' onClick={onClose}></div>
          <div className={`modal-main menu-content-box-shadow ${props?.className ?? ''}`.trim()} style={props?.style} onClick={handleStopPropagation}>
            {layout?.header && (
              <div className='modal-header'>
                <div className='modal-header-text'>{layout?.header?.title}</div>
                {layout?.header?.closeIcon && (
                  <Button
                    style={{ fontSize: '1.4rem', paddingLeft: '0.8rem', paddingRight: '0.8rem' }}
                    className='modal-header-close-button'
                    variant='text'
                    theme='default'
                    onClick={onClose}
                  >
                    <i className='fa-solid fa-xmark'></i>
                  </Button>
                )}
              </div>
            )}
            <div className='modal-body'>{children}</div>
            {layout?.footer && <div className='modal-footer'>{layout?.footer}</div>}
          </div>
        </div>
      )}
    </>
  )
}

export default Modal

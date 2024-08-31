import Button from '@comps/Button'
import RenderIf from '@comps/containers/RenderIf'
import { stopPropagation } from '@utils/functions'
import { CustomizablePropType } from '@utils/types'
import { Theme } from '@utils/types/theme.type'
import './Modal.scss'
import './ModalWidth.scss'

interface ModalProps extends React.ComponentProps<'div'> {
  open?: boolean
  layout?: {
    theme?: Theme
    header?: {
      title?: React.ReactNode
      closeIcon?: boolean
    }
    footer?: React.ReactNode
    overlay?: CustomizablePropType
  }
  children?: React.ReactNode
  onClose?: () => void
  propagation?: boolean
}

function Modal({
  open = false,
  propagation = false,
  layout = undefined,
  children = '',
  onClose = () => {},
  ...props
}: ModalProps) {
  // chuc nang xoa task
  return (
    <RenderIf check={open && children}>
      <div
        className={`modal${layout?.theme ? ' ' + layout.theme + '-modal' : ' default-modal'}`}
        onClick={propagation ? stopPropagation : undefined}
      >
        <div className='overlay' onClick={onClose}></div>
        <div className={`modal-main menu-content-box-shadow ${props?.className ?? ''}`.trim()} style={props?.style}>
          <RenderIf check={!!layout?.header}>
            <div className='modal-header'>
              <div className='modal-header-text'>{layout?.header?.title}</div>
              <RenderIf check={!!layout?.header?.closeIcon}>
                <Button className='modal-header-close-button' variant='text' theme='default' onClick={onClose}>
                  <i className='fa-solid fa-xmark'></i>
                </Button>
              </RenderIf>
            </div>
          </RenderIf>
          <div className='modal-body'>{children}</div>
          <RenderIf check={!!layout?.footer}>
            <div className='modal-footer'>{layout?.footer}</div>
          </RenderIf>
        </div>
      </div>
    </RenderIf>
  )
}

export default Modal

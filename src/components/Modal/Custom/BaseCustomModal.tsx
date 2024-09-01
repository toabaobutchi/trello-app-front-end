import { Theme } from '@utils/types/theme.type'
import Modal from '..'
import { CustomizablePropType } from '@utils/types'

type ModalPropsType = React.ComponentPropsWithoutRef<typeof Modal>

type BaseCustomModalProps = {
  title?: React.ReactNode
  closeIcon?: boolean
  theme?: Theme
  footer?: React.ReactNode
  overlay?: CustomizablePropType
} & Omit<ModalPropsType, 'layout' | 'title'>

function BaseCustomModal({
  title,
  closeIcon = true,
  theme,
  footer,
  children,
  overlay,
  open,
  onClose,
  ...props
}: BaseCustomModalProps) {
  return (
    <>
      <Modal open={open} onClose={onClose} layout={{ header: { title, closeIcon }, theme, footer, overlay }} {...props}>
        {children}
      </Modal>
    </>
  )
}

export default BaseCustomModal

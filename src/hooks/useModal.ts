import { useState } from 'react'

export type UseModalOptions = {
  whenOpen?: () => void
  whenClose?: () => void
}

export function useModal(
  initState: boolean = false,
  options: UseModalOptions = {
    whenOpen: () => {},
    whenClose: () => {}
  }
) {
  const [modalOpen, setModalOpen] = useState(initState)

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setModalOpen(prevState => !prevState)
    if (!modalOpen) options.whenOpen?.()
    if (modalOpen) options.whenClose?.()
  }

  return [modalOpen, handleToggle, setModalOpen] as const
}

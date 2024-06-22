import Button from '@comps/Button'
import { memo, useState } from 'react'
import './ProjectFilterMenu.scss'
import Modal from '@comps/Modal'
import MultipleSelectList from '@comps/MultipleSelectList'
import { SelectListItem } from '@utils/types'
import ButtonGroup from '@comps/ButtonGroup'

const items = [
  {
    value: 'high',
    display: 'High'
  },
  {
    value: 'medium',
    display: 'Medium'
  },
  {
    value: 'normal',
    display: 'Normal'
  },
  {
    value: 'low',
    display: 'Low'
  },
  {
    value: 'not set',
    display: 'Not set'
  }
]

const ProjectFilterMenu = memo(() => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleToggleModal = () => setModalOpen(!modalOpen)

  // sau này sẽ sử dụng Redux để lưu trữ
  const [priorities, setPriorities] = useState<SelectListItem[]>([])
  const handleSelectPriority = (items: SelectListItem[]) => {
    setPriorities(items)
  }
  return (
    <>
      <ButtonGroup
        openAction={priorities.length !== 0}
        actionButton={
          <Button variant='text' theme='danger'>
            <i className="fa-regular fa-trash-can"></i>
          </Button>
        }
      >
        <Button onClick={handleToggleModal} variant='text' theme='default'>
          <i className='fa-solid fa-filter'></i> Filters
        </Button>
      </ButtonGroup>
      <Modal onClose={handleToggleModal} open={modalOpen} layout={{ header: { title: 'Filters', closeIcon: true } }}>
        <MultipleSelectList items={items} selectedItems={priorities} label='Priority' onSelect={handleSelectPriority} />
      </Modal>
    </>
  )
})

export default ProjectFilterMenu

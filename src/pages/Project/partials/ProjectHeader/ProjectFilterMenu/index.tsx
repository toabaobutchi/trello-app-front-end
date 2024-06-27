import Button from '@comps/Button'
import { memo, useState } from 'react'
import './ProjectFilterMenu.scss'
import Modal from '@comps/Modal'
import MultipleSelectList from '@comps/MultipleSelectList'
import { SelectListItem } from '@utils/types'
import ButtonGroup from '@comps/ButtonGroup'
import Tooltip from '@comps/Tooltip'
import Input from '@comps/Input'
import Flex from '@comps/StyledComponents/Flex'

// co the hard code nhu the nay
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

const taskMembers = [
  {
    value: 'abcd1h@gmail.com',
    display: 'abcd1h@gmail.com'
  },
  {
    value: 'dsau23la@gmail.com',
    display: 'dsau23la@gmail.com'
  },
  {
    value: 'mlsoie@gmail.com',
    display: 'mlsoie@gmail.com'
  },
  {
    value: 'sa473t@gmail.com',
    display: 'sa473t@gmail.com'
  },
  {
    value: 'j3wsfw@gmail.com',
    display: 'j3wsfw@gmail.com'
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

  // sau này sẽ sử dụng Redux để lưu trữ (lưu song song với thông tin project)
  const [members, setMembers] = useState<SelectListItem[]>([])
  const handleSelectMember = (items: SelectListItem[]) => {
    setMembers(items)
  }
  const handleClearFilter = () => {
    setPriorities([])
    setMembers([])
  }
  return (
    <>
      <ButtonGroup
        openAction={priorities.length !== 0}
        actionButton={
          <Tooltip content='Clear all filters' arrow delay={0.5}>
            <Button onClick={handleClearFilter} variant='text' theme='danger'>
              <i className='fa-regular fa-trash-can'></i>
            </Button>
          </Tooltip>
        }
      >
        <Button onClick={handleToggleModal} variant='text' theme='default'>
          <i className='fa-solid fa-filter'></i> Filters
        </Button>
      </ButtonGroup>
      <Modal
        style={{ width: '30%' }}
        onClose={handleToggleModal}
        open={modalOpen}
        layout={{
          header: { title: 'Filters', closeIcon: true }
        }}
      >
        <MultipleSelectList items={items} selectedItems={priorities} label='Priority' onSelect={handleSelectPriority} />
        <p style={{ marginTop: '0.5rem' }}>Assignees</p>
        <MultipleSelectList
          items={taskMembers}
          selectedItems={members}
          // label='Assignees'
          onSelect={handleSelectMember}
        />
        <Flex $alignItem='center' $gap='0.5rem' style={{ margin: '0.5rem 0' }}>
          <span>or</span>
          <Input.CheckBox
            id='filter-no-assignee'
            borderTheme={{ normal: 'light', onChecked: 'danger', applyToForeground: true }}
            label={{ style: { padding: '0.5rem' } }}
          >
            No assignees <i className='fa-solid fa-user-slash'></i>
          </Input.CheckBox>
        </Flex>
      </Modal>
    </>
  )
})

export default ProjectFilterMenu

import Button from '@comps/Button'
import { memo, useEffect, useState } from 'react'
import './ProjectFilterMenu.scss'
import Modal from '@comps/Modal'
import MultipleSelectList from '@comps/MultipleSelectList'
import { FilterType, SelectListItem } from '@utils/types'
import ButtonGroup from '@comps/ButtonGroup'
import Tooltip from '@comps/Tooltip'
import Input from '@comps/Input'
import Flex from '@comps/StyledComponents/Flex'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import SwitchButton from '@comps/SwitchButton'

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

const initValue: FilterType = {
  isFiltering: false,
  priorities: [],
  members: [],
  dueDate: undefined,
  overDueFilter: false,
  noAssigneesFilter: false
}
const ProjectFilterMenu = memo(() => {
  const [filter, setFilter] = useState<FilterType>(initValue)
  const [modalOpen, setModalOpen] = useState(false)
  const handleToggleModal = () => setModalOpen(!modalOpen)

  const handleSelectPriority = (items: SelectListItem[]) => {
    setFilter(prev => ({ ...prev, isFiltering: true, priorities: items }))
  }
  const handleSelectMember = (items: SelectListItem[]) => {
    setFilter(prev => ({ ...prev, isFiltering: true, members: items }))
  }
  const handleSelectNoAssigneeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, isFiltering: true, noAssigneesFilter: e.target.checked }))
  }
  const handleToggleDueDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, isFiltering: true, dueDate: e.target.checked ? new Date() : undefined }))
  }
  const handleToggleOverdueFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, isFiltering: true, overDueFilter: e.target.checked }))
  }

  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)
  const handleClearFilter = () => {
    setFilter(initValue)
  }
  const handleFilter = () => {
    // dispatch cho store
    handleToggleModal()
  }
  console.log(filter)
  return (
    <>
      <ButtonGroup
        openAction={filter.isFiltering}
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
        <MultipleSelectList
          items={items}
          selectedItems={filter?.priorities}
          label='Priority'
          onSelect={handleSelectPriority}
        />
        <p style={{ marginTop: '0.5rem' }}>Assignees</p>
        <MultipleSelectList
          items={projectMembers?.map(pm => ({ value: pm.email, display: pm.email }))}
          selectedItems={filter?.members}
          onSelect={handleSelectMember}
        />
        <Flex $alignItem='center' $gap='0.5rem' style={{ margin: '0.5rem 0' }}>
          <span>or</span>
          <Input.CheckBox
            id='filter-no-assignee'
            checked={filter?.noAssigneesFilter}
            borderTheme={{ normal: 'light', onChecked: 'danger', applyToForeground: true }}
            label={{ style: { padding: '0.5rem' } }}
            onChange={handleSelectNoAssigneeFilter}
          >
            No assignees <i className='fa-solid fa-user-slash'></i>
          </Input.CheckBox>
        </Flex>
        <Flex
          className='w-full'
          $alignItem='center'
          $flexDirection='column'
          $gap='1rem'
          $justifyContent='space-between'
        >
          <p className='w-full mt-1'>Due date</p>
          <Flex className='w-full' $alignItem='center' $gap='0.5rem'>
            <SwitchButton
              inputAttributes={{
                type: 'radio',
                name: 'dueDateFilter',
                id: 'choose-due-date-option',
                checked: filter.dueDate !== undefined
              }}
              onChange={handleToggleDueDateFilter}
            />
            <label htmlFor="'choose-due-date-option'">Due date by</label>
          </Flex>
          <Flex className='w-full' $alignItem='center' $gap='0.5rem'>
            <SwitchButton
              inputAttributes={{
                type: 'radio',
                name: 'dueDateFilter',
                id: 'choose-over-due-option',
                checked: filter.overDueFilter
              }}
              onChange={handleToggleOverdueFilter}
            />
            <label htmlFor='choose-over-due-option'>Overdue</label>
          </Flex>
        </Flex>
        <Flex $alignItem='center' $justifyContent='end'>
          <Button onClick={handleFilter} variant='filled'>
            Apply filters
          </Button>
        </Flex>
      </Modal>
    </>
  )
})

export default ProjectFilterMenu

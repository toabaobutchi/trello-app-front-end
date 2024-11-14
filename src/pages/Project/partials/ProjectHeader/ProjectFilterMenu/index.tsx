import Button from '@comps/Button'
import { memo, useState } from 'react'
import './ProjectFilterMenu.scss'
import Modal from '@comps/Modal'
import MultipleSelectList from '@comps/MultipleSelectList'
import { ProjectFilterType, SelectListItem } from '@utils/types'
import ButtonGroup from '@comps/ButtonGroup'
import Tooltip from '@comps/Tooltip'
import Input from '@comps/Input'
import Flex from '@comps/StyledComponents/Flex'
import { useDispatch } from 'react-redux'
import SwitchButton from '@comps/SwitchButton'
import { getDateTimeString } from '@utils/functions'
import { projectSlice } from '@redux/ProjectSlice'
import { useProjectSelector } from '@hooks/useProjectSelector'

// co the hard code nhu the nay
const items = [
  {
    value: 'High',
    display: <p className='text-danger'>High</p>
  },
  {
    value: 'Medium',
    display: <p className='text-warning'>Medium</p>
  },
  {
    value: 'Normal',
    display: <p className='text-primary'>Normal</p>
  },
  {
    value: 'Low',
    display: <p className='text-success'>Low</p>
  },
  {
    value: '',
    display: <p className='text-secondary'>Not set</p>
  }
]

const initValue: ProjectFilterType = {
  priorities: [],
  dueDate: undefined,
  noAssigneesFilter: false,
  assignToMe: undefined,
  members: undefined,
  needHelp: false,
  overdue: false,
  completed: false,
  dueSoon: false
}

const ProjectFilterMenu = memo(() => {
  const [filter, setFilter] = useState<ProjectFilterType>(initValue)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const { members, board } = useProjectSelector()
  const handleToggleModal = () => setModalOpen(!modalOpen)

  const handleSelectPriority = (items: SelectListItem[]) => {
    setFilter(prev => ({
      ...prev,
      priorities: items
    }))
  }
  const handleSelectNoAssigneeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFilter(prev => ({
      ...prev,
      noAssigneesFilter: checked
    }))
  }
  const handleToggleDueDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFilter(prev => ({
      ...prev,
      dueDate: checked ? new Date().getTime() : undefined
    }))
  }
  const handleSelectAssignToMeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      assignToMe: e.target.value
    }))
  }
  const handleChangeDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      dueDate: new Date(e.target.value).getTime()
    }))
  }
  const handleSelectMembers = (members: SelectListItem[]) => {
    setFilter(prev => ({
      ...prev,
      members
    }))
  }
  const handleSelectTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const elementName = e.target.name
    if (elementName) {
      setFilter(prev => ({
        ...prev,
        [elementName]: checked
      }))
    }
  }

  // const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)
  const handleClearFilter = () => {
    setFilter(initValue)
    dispatch(projectSlice.actions.setFilters(initValue))
  }
  const handleFilter = () => {
    // dispatch cho store
    dispatch(projectSlice.actions.setFilters(filter))
    handleToggleModal()
  }
  const isFiltering = (filter?.priorities?.length ?? 0) > 0 || filter?.dueDate !== undefined || filter?.noAssigneesFilter || Boolean(filter?.assignToMe) || (filter?.members?.length ?? 0) > 0

  return (
    <>
      <ButtonGroup
        openAction={isFiltering}
        actionButton={
          <Tooltip content='Clear all filters' arrow delay={0.5}>
            <Button onClick={handleClearFilter} variant='text' theme='danger'>
              <i className='fa-regular fa-trash-can'></i>
            </Button>
          </Tooltip>
        }
      >
        <Button onClick={handleToggleModal} variant='text' theme={`${isFiltering ? 'primary' : 'light'}`}>
          <i className='fa-solid fa-filter' /> Filters
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
        <MultipleSelectList items={items} selectedItems={filter?.priorities} label={<span className='filter-item-title'>Priorities</span>} onSelect={handleSelectPriority} />
        <p className='mt-2 filter-item-title'>Assignees</p>
        <MultipleSelectList items={members?.map(pm => ({ value: pm.id, display: pm.email }))} selectedItems={filter?.members} onSelect={handleSelectMembers} />
        <Flex $alignItem='center' $gap='0.5rem' style={{ margin: '0.5rem 0' }}>
          <SwitchButton
            theme={{
              checked: 'danger'
            }}
            inputAttributes={{
              type: 'checkbox',
              id: 'filter-no-assignee',
              name: 'filterNoAssignee',
              checked: filter?.noAssigneesFilter
            }}
            onChange={handleSelectNoAssigneeFilter}
            icon={{
              checked: <i className='fa-solid fa-user-slash'></i>
            }}
          />
          <label htmlFor='filter-no-assignee' className={`cpointer ${filter?.noAssigneesFilter ? 'text-danger bold' : 'text-light'}`}>
            No assignees <i className='fa-solid fa-user-slash'></i>
          </label>
        </Flex>
        <Flex $alignItem='center' $gap='0.5rem' style={{ margin: '0.5rem 0' }}>
          <SwitchButton
            inputAttributes={{
              type: 'checkbox',
              id: 'filter-assign-to-me',
              name: 'filterAssignToMe',
              checked: Boolean(filter?.assignToMe),
              value: board.assignmentId
            }}
            onChange={handleSelectAssignToMeFilter}
          />
          <label htmlFor='filter-assign-to-me' className={`cpointer ${filter?.assignToMe ? 'text-success bold' : 'text-light'}`}>
            Assign to me <i className='fa-solid fa-user-check'></i>
          </label>
        </Flex>
        <Flex className='w-full' $alignItem='center' $flexDirection='column' $gap='1rem' $justifyContent='space-between'>
          <p className='w-full mt-2 filter-item-title'>Due date</p>
          <Flex className='w-full mb-1' $alignItem='center' $flexWrap='wrap' $gap='0.5rem' $justifyContent='space-between'>
            <Flex $alignItem='center' $gap='0.5rem'>
              <SwitchButton
                inputAttributes={{
                  type: 'checkbox',
                  name: 'dueDateFilter',
                  id: 'choose-due-date-option',
                  checked: filter.dueDate !== undefined
                }}
                onChange={handleToggleDueDateFilter}
              />
              <label htmlFor='choose-due-date-option' className={filter.dueDate !== undefined ? 'text-success bold' : 'text-light'}>
                Due date by
              </label>
              <input
                className='due-date-filter-input'
                type='datetime-local'
                name='dueDate'
                value={filter.dueDate ? getDateTimeString(new Date(filter?.dueDate)) : ''}
                id='due-date-selector'
                disabled={!filter.dueDate}
                onChange={handleChangeDueDate}
              />
            </Flex>
          </Flex>
        </Flex>
        <p className='mt-2 filter-item-title'>Tags</p>
        <Flex className='w-full my-1' $alignItem='center' $flexWrap='wrap' $gap='0.5rem'>
          <Input.CheckBox
            id='filter-overdue'
            checked={filter?.overdue}
            borderTheme={{ normal: 'light', onChecked: 'danger', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            name='overdue'
            onChange={handleSelectTag}
          >
            Overdue <i className='fa-regular fa-calendar-xmark'></i>
          </Input.CheckBox>
          <Input.CheckBox
            id='filter-duesoon'
            checked={filter?.dueSoon}
            borderTheme={{ normal: 'light', onChecked: 'warning', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            name='dueSoon'
            onChange={handleSelectTag}
          >
            Duesoon <i className='fa-solid fa-hourglass-half'></i>
          </Input.CheckBox>
          <Input.CheckBox
            id='filter-completed'
            checked={filter?.completed}
            borderTheme={{ normal: 'light', onChecked: 'success', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            name='completed'
            onChange={handleSelectTag}
          >
            Completed <i className='fa-solid fa-check'></i>
          </Input.CheckBox>
          <Input.CheckBox
            id='filter-needhelp'
            checked={filter?.needHelp}
            borderTheme={{ normal: 'light', onChecked: 'danger', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            name='needHelp'
            onChange={handleSelectTag}
          >
            Need help <i className='fa-regular fa-circle-question'></i>
          </Input.CheckBox>
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

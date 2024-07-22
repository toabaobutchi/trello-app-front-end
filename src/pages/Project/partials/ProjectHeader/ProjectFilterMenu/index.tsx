import Button from '@comps/Button'
import { memo, useState } from 'react'
import './ProjectFilterMenu.scss'
import Modal from '@comps/Modal'
import MultipleSelectList from '@comps/MultipleSelectList'
import { FilterType, SelectListItem } from '@utils/types'
import ButtonGroup from '@comps/ButtonGroup'
import Tooltip from '@comps/Tooltip'
import Input from '@comps/Input'
import Flex from '@comps/StyledComponents/Flex'
import { useDispatch } from 'react-redux'
// import { RootState } from '@redux/store'
import SwitchButton from '@comps/SwitchButton'
import { getDateTimeString } from '@utils/functions'
import { projectSlice } from '@redux/ProjectSlice'
import { useProjectSelector } from '@hooks/useProjectSelector'
import CheckBox from '@comps/CheckBox'

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

const initValue: FilterType = {
  isFiltering: false,
  priorities: [],
  dueDate: undefined,
  overDueFilter: false,
  noAssigneesFilter: false,
  members: undefined
}

const ProjectFilterMenu = memo(() => {
  const [filter, setFilter] = useState<FilterType>(initValue)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const { members } = useProjectSelector()
  const handleToggleModal = () => setModalOpen(!modalOpen)

  const handleSelectPriority = (items: SelectListItem[]) => {
    setFilter(prev => ({ ...prev, isFiltering: true, priorities: items }))
  }
  const handleSelectNoAssigneeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, isFiltering: true, noAssigneesFilter: e.target.checked }))
  }
  const handleToggleDueDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, isFiltering: true, dueDate: e.target.checked ? new Date().getTime() : undefined }))
  }
  const handleToggleOverdueFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, isFiltering: true, overDueFilter: e.target.checked }))
  }
  const handleChangeDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, isFiltering: true, dueDate: new Date(e.target.value).getTime() }))
  }
  const handleSelectMembers = (members: SelectListItem[]) => {
    setFilter(prev => ({ ...prev, isFiltering: true, members }))
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
        <Button onClick={handleToggleModal} variant='text' theme='primary'>
          <i className='fa-solid fa-sliders'></i> Filters
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
          items={members?.map(pm => ({ value: pm.id, display: pm.email }))}
          selectedItems={filter?.members}
          onSelect={handleSelectMembers}
        />
        <Flex $alignItem='center' $gap='0.5rem' style={{ margin: '0.5rem 0' }}>
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
          <Flex
            className='w-full mb-1'
            $alignItem='center'
            $flexWrap='wrap'
            $gap='0.5rem'
            $justifyContent='space-between'
          >
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
              <label htmlFor='choose-due-date-option'>Due date by</label>
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
            {/* <Flex $alignItem='center' $gap='0.5rem'>
              <SwitchButton
                inputAttributes={{
                  type: 'checkbox',
                  name: 'dueDateFilter',
                  id: 'choose-over-due-option',
                  checked: filter.overDueFilter
                }}
                onChange={handleToggleOverdueFilter}
                icon={{
                  checked: <i className='fa-regular fa-calendar-xmark'></i>,
                  unchecked: <i className='fa-regular fa-calendar-check'></i>
                }}
                theme={{ checked: 'danger' }}
                foreGround
              />
              <label htmlFor='choose-over-due-option'>Overdue</label>
            </Flex> */}
          </Flex>
        </Flex>
        <p>Tags</p>
        <Flex className='w-full my-1' $alignItem='center' $flexWrap='wrap' $gap='0.5rem'>
          <Input.CheckBox
            id='filter-overdue'
            checked={filter?.noAssigneesFilter}
            borderTheme={{ normal: 'light', onChecked: 'danger', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            // onChange={handleSelectNoAssigneeFilter}
          >
            Overdue <i className='fa-regular fa-calendar-xmark'></i>
          </Input.CheckBox>
          <Input.CheckBox
            id='filter-duesoon'
            checked={filter?.noAssigneesFilter}
            borderTheme={{ normal: 'light', onChecked: 'warning', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            // onChange={handleSelectNoAssigneeFilter}
          >
            Duesoon <i className='fa-solid fa-hourglass-half'></i>
          </Input.CheckBox>
          <Input.CheckBox
            id='filter-completed'
            checked={filter?.noAssigneesFilter}
            borderTheme={{ normal: 'light', onChecked: 'success', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            // onChange={handleSelectNoAssigneeFilter}
          >
            Completed <i className='fa-solid fa-check'></i>
          </Input.CheckBox>
          <Input.CheckBox
            id='filter-needhelp'
            checked={filter?.noAssigneesFilter}
            borderTheme={{ normal: 'light', onChecked: 'danger', applyToForeground: true }}
            label={{ style: { padding: '0.25rem 0.5rem', borderRadius: '13px' } }}
            // onChange={handleSelectNoAssigneeFilter}
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

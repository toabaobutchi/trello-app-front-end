import Button from '@comps/Button'
import './YourTasks.scss'
import Modal from '@comps/Modal'
import { useState } from 'react'
import Input from '@comps/Input'
import Flex from '@comps/StyledComponents'
import Tooltip from '@comps/Tooltip'

// type PriorityType = {
//   value: string | number
// }

const priorities = {
  values: { low: 0, medium: 1, high: 2 },
  displays: [
    { text: 'Low', theme: 'primary' },
    { text: 'Medium', theme: 'warning' },
    { text: 'High', theme: 'danger' }
  ]
}

interface FilterState {
  modalOpen: boolean
  criteria: {
    priority: number[]
    taskName: string
  }
}

const initValue: FilterState = {
  modalOpen: false,
  criteria: {
    priority: [],
    taskName: ''
  }
}

function YourTasks() {
  const [filters, setFilters] = useState<FilterState>(initValue)
  const [tempFilters, setTempFilters] = useState<FilterState>(initValue)
  const handleToggleFilterModal = () => {
    setFilters({
      ...filters,
      modalOpen: !filters?.modalOpen
    })
  }
  const applyFilters = () => {
    setFilters(tempFilters)
  }
  const clearAllFilters = () => {
    setFilters(initValue)
    setTempFilters(initValue)
  }
  const handleChangeTempFilters = {
    searchName(e: React.ChangeEvent<HTMLInputElement>) {
      setTempFilters({
        ...tempFilters,
        criteria: {
          ...tempFilters?.criteria,
          taskName: e.target.value.trim()
        }
      })
    },
    priority(e: React.ChangeEvent<HTMLInputElement>) {
      let priorities: number[] = []
      if (e.target.checked) {
        priorities = [...tempFilters.criteria.priority, parseInt(e.target.value)]
      } else {
        priorities = tempFilters.criteria.priority.filter(item => item !== parseInt(e.target.value))
      }
      setTempFilters({
        ...tempFilters,
        criteria: {
          ...tempFilters?.criteria,
          priority: priorities
        }
      })
    }
  }
  return (
    <>
      <p className='page-header'>
        <i className='fa-solid fa-list-check'></i>&nbsp; Your tasks
      </p>
      <div className='task-list'>
        <div className='task-list-filters'>
          <Flex $gap='1rem' $flexWrap='wrap' $alignItem='center'>
            <Tooltip content='This is a tooltip 1' theme='dark' position='bottom'>
              <Button
                onClick={handleToggleFilterModal}
                variant='outlined'
                theme={filters.criteria.taskName || filters.criteria.priority.length ? 'primary' : 'secondary'}
              >
                <i className='fa-solid fa-filter'></i> Filters
              </Button>
            </Tooltip>

            {Boolean(filters.criteria.taskName || filters.criteria.priority.length) && (
              <>
                <Tooltip content='This is a tooltip 2' theme='dark' position='top'>
                  <Button onClick={clearAllFilters} variant='outlined' theme='danger'>
                    <i className='fa-solid fa-xmark'></i> Clear filters
                  </Button>
                </Tooltip>
              </>
            )}
            <Tooltip content='This is left tooltip' position='left'>
              Left tooltip
            </Tooltip>
            <Tooltip content='This is right tooltip' position='right'>
              Right tooltip
            </Tooltip>
          </Flex>
          <Modal
            style={{ width: '30%', minWidth: '400px', maxWidth: '100%' }}
            open={filters?.modalOpen}
            layout={{
              header: { title: 'Filters', closeIcon: true },
              theme: 'info',
              footer: (
                <>
                  <Button onClick={applyFilters} variant='outlined' style={{ fontWeight: 600 }} theme='success'>
                    <i className='fa-solid fa-check'></i> Apply filters
                  </Button>
                </>
              )
            }}
            onClose={handleToggleFilterModal}
          >
            <Input.TextBox
              className='input-focus-shadow'
              label={{ content: 'Search tasks' }}
              value={filters.criteria.taskName}
              id='search-task-input'
              onChange={handleChangeTempFilters.searchName}
            />
            <p style={{ margin: '0.5rem 0' }}>Priority:</p>
            <Flex $alignItem='center' $gap='0.5rem'>
              {priorities.displays.map((item, index) => {
                return (
                  <Input.CheckBox
                    key={index}
                    onChange={handleChangeTempFilters.priority}
                    borderTheme={{ onChecked: item.theme, applyToForeground: true }}
                    label={{ style: { padding: '0.5rem 1rem' } }}
                    id={`priority-${index}`}
                    value={index}
                    checked={filters.criteria.priority.includes(index)}
                  >
                    {priorities.displays[index].text}
                  </Input.CheckBox>
                )
              })}
            </Flex>
          </Modal>
        </div>
      </div>
    </>
  )
}

export default YourTasks

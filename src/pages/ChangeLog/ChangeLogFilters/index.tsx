import SelectList from '@comps/SelectList'
import './ChangeLogFilters.scss'
import { SelectListItem } from '@utils/types'
import { useEffect, useRef, useState } from 'react'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { useSearchParams } from 'react-router-dom'
import { getDateString, getFlatTasks, getMiliseconds } from '@utils/functions'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'
import { TaskResponseForBoard } from '@utils/types/task.type'

function ChangeLogFilters() {
  const { members } = useProjectSelector()
  const [searchParams, setSearchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const memberSearchParam = searchParams.get('uid') ?? 'all'
  const dateSearchParam = searchParams.get('d')
  const taskSearchParam = searchParams.get('task') ?? 'all'
  const page = searchParams.get('p')

  const { board: project } = useProjectSelector()
  const [tasks, setTasks] = useState<TaskResponseForBoard[]>([])

  useEffect(() => {
    setTasks(getFlatTasks(project) ?? [])
  }, [project])

  const handleTogglePicker = () => {
    if (inputRef?.current) {
      inputRef.current.showPicker()
    }
  }
  const memberSelectListItems: SelectListItem[] = [
    {
      value: 'all',
      display: (
        <>
          <i className='fa-solid fa-user-group'></i>&nbsp; All members
        </>
      )
    },
    ...members.map(
      m =>
        ({
          value: m.id,
          display: (
            <div className='row gap-1'>
              <img className='change-logs-filters-members-avatar' src={m.avatar} alt='avatar' />
              <p>{m.displayName}</p>
            </div>
          )
        } as SelectListItem)
    )
  ]

  const taskSelectListItems: SelectListItem[] = [
    {
      value: 'all',
      display: (
        <>
          <i className='fa-solid fa-tasks'></i>&nbsp; All tasks
        </>
      )
    },
    ...tasks.map(t => ({
      value: t.id,
      display: t.name
    }))
  ]

  const handleSelectTaskFilter = ({ value }: { value: string }) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('task', value)
    newSearchParams.delete('p')
    setSearchParams(newSearchParams)
  }

  const handleChangeDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    const selectedDate = new Date(e.target.value)
    const miliseconds = getMiliseconds(selectedDate)
    newSearchParams.set('d', miliseconds.toString())
    newSearchParams.delete('p')
    setSearchParams(newSearchParams)
  }

  const handleChooseMemberFilter = ({ value }: { value: string }) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('uid', value)
    newSearchParams.delete('p')
    setSearchParams(newSearchParams)
  }

  const handleLoadMore = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    const nextPage = parseInt(page ?? '1') + 1
    newSearchParams.set('p', nextPage.toString())

    setSearchParams(newSearchParams)
  }
  const handleGetPrevious = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    const previousPage = parseInt(page ?? '1') - 1
    newSearchParams.set('p', previousPage.toString())
    setSearchParams(newSearchParams)
  }

  return (
    <>
      <div className='change-logs-filters row gap-2 w-full'>
        <Flex $alignItem='center' $gap='0.5rem' className='change-logs-page'>
          {Boolean(parseInt(page ?? '1') - 1) && (
            <Button onClick={handleGetPrevious} variant='text' theme='default'>
              <i className='fa-solid fa-chevron-left'></i> Previous
            </Button>
          )}
          <Button variant='text' onClick={handleLoadMore} className='row gap-2' theme='default'>
            Next <i className='fa-solid fa-angle-right'></i>
          </Button>
        </Flex>

        <Flex $alignItem='center' $gap='0.5rem'>
          {tasks.length > 0 && (
            <SelectList
              size='small'
              className='change-logs-filters-select-list change-logs-filters-tasks'
              items={taskSelectListItems}
              selectedValue={taskSearchParam}
              onChoose={handleSelectTaskFilter}
            />
          )}

          {members.length > 0 && (
            <SelectList
              onChoose={handleChooseMemberFilter}
              className='change-logs-filters-select-list change-logs-filters-members'
              selectedValue={memberSearchParam}
              items={memberSelectListItems}
            />
          )}
          <div className='change-logs-filters-date'>
            <input
              onChange={handleChangeDateFilter}
              ref={inputRef}
              type='datetime-local'
              name='changeLogsFiltersDate'
              id='change-logs-filters-date'
            />
            <label htmlFor='change-logs-filters-date' onClick={handleTogglePicker}>
              <i className='fa-regular fa-calendar'></i>{' '}
              {dateSearchParam === null ? 'All dates' : getDateString(new Date(parseInt(dateSearchParam)))}{' '}
              <i className='fa-solid fa-caret-down'></i>
            </label>
          </div>
        </Flex>
      </div>
    </>
  )
}

export default ChangeLogFilters

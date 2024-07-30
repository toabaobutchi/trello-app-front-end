import SelectList from '@comps/SelectList'
import './ChangeLogFilters.scss'
import { SelectListItem } from '@utils/types'
import { useRef } from 'react'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { useSearchParams } from 'react-router-dom'
import { getDateString, getMiliseconds } from '@utils/functions'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'

function ChangeLogFilters() {
  const { members } = useProjectSelector()
  const [searchParams, setSearchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const memberSearchParam = searchParams.get('uid') ?? 'all'
  const dateSearchParam = searchParams.get('d')
  const page = searchParams.get('p')

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

  const handleChangeDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    const selectedDate = new Date(e.target.value)
    const miliseconds = getMiliseconds(selectedDate)
    newSearchParams.set('d', miliseconds.toString())
    newSearchParams.set('p', '1')
    setSearchParams(newSearchParams)
  }
  const handleChooseMemberFilter = ({ value }: { value: string }) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('uid', value)
    newSearchParams.set('p', '1')
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
          {members.length > 0 && (
            <SelectList
              onChoose={handleChooseMemberFilter}
              className='change-logs-filters-members'
              selectedValue={memberSearchParam}
              items={memberSelectListItems}
              // manualSelectedValue={memberSearchParam}
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

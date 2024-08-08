import { useSearchParams } from 'react-router-dom'
import TableHeaderSort from '../TableHeaderSort'
import { LinearSort, SORT_BY_START_DATE } from '..'
import MenuItem from '@comps/MenuItem'

function SortByStartDateMenu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleSortByStartDate = (value: LinearSort) => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.set(SORT_BY_START_DATE, value)
      return newSearchParams
    })
  }
  const handleClearSortByStartDate = () => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.delete(SORT_BY_START_DATE)
      return newSearchParams
    })
  }
  return (
    <>
      <TableHeaderSort
        header={
          <>
            Start date&nbsp;{' '}
            {searchParams.get(SORT_BY_START_DATE) ? (
              searchParams.get(SORT_BY_START_DATE) === 'asc' ? (
                <i className='fa-solid fa-arrow-down-1-9'></i>
              ) : (
                <i className='fa-solid fa-arrow-down-9-1'></i>
              )
            ) : (
              <i className='fa-solid fa-sort'></i>
            )}
          </>
        }
      >
        <MenuItem onClick={() => handleSortByStartDate('asc')}>
          <i className='fa-solid fa-arrow-down-1-9'></i> Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortByStartDate('desc')}>
          <i className='fa-solid fa-arrow-down-9-1'></i> Descending
        </MenuItem>
        <MenuItem onClick={handleClearSortByStartDate} size='small' className='border-top text-danger'>
          <i className='fa-solid fa-wand-magic-sparkles'></i> Clear sort
        </MenuItem>
      </TableHeaderSort>
    </>
  )
}

export default SortByStartDateMenu

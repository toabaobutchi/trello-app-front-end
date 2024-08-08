import { useSearchParams } from 'react-router-dom'
import { LinearSort, SORT_BY_DUE_DATE } from '..'
import TableHeaderSort from '../TableHeaderSort'
import MenuItem from '@comps/MenuItem'

function SortByDueDateMenu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleSortByDueDate = (value: LinearSort) => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.set(SORT_BY_DUE_DATE, value)
      return newSearchParams
    })
  }
  const handleClearSortByDueDate = () => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.delete(SORT_BY_DUE_DATE)
      return newSearchParams
    })
  }
  return (
    <>
      <TableHeaderSort
        header={
          <>
            Start date&nbsp;{' '}
            {searchParams.get(SORT_BY_DUE_DATE) ? (
              searchParams.get(SORT_BY_DUE_DATE) === 'asc' ? (
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
        <MenuItem onClick={() => handleSortByDueDate('asc')}>
          <i className='fa-solid fa-arrow-down-1-9'></i> Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortByDueDate('desc')}>
          <i className='fa-solid fa-arrow-down-9-1'></i> Descending
        </MenuItem>
        <MenuItem onClick={handleClearSortByDueDate} size='small' className='border-top text-danger'>
          <i className='fa-solid fa-wand-magic-sparkles'></i> Clear sort
        </MenuItem>
      </TableHeaderSort>
    </>
  )
}

export default SortByDueDateMenu

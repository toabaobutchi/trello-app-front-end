import { useSearchParams } from 'react-router-dom'
import { SORT_BY_SUBTASK, SubtaskSort } from '..'
import TableHeaderSort from '../TableHeaderSort'
import MenuItem from '@comps/MenuItem'

function SortBySubtaskMenu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleSortBySubtaskMenu = (value: SubtaskSort) => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.set(SORT_BY_SUBTASK, value)
      return newSearchParams
    })
  }
  const handleClearSortBySubtaskMenu = () => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.delete(SORT_BY_SUBTASK)
      return newSearchParams
    })
  }
  return (
    <>
      <TableHeaderSort
        header={
          <>
            Subtask&nbsp;{' '}
            {searchParams.get(SORT_BY_SUBTASK) ? (
              searchParams.get(SORT_BY_SUBTASK) === 'asc' ? (
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
        <MenuItem onClick={() => handleSortBySubtaskMenu('asc')}>
          <i className='fa-solid fa-arrow-down-1-9'></i> Ascending by subtask count
        </MenuItem>
        <MenuItem onClick={() => handleSortBySubtaskMenu('desc')}>
          <i className='fa-solid fa-arrow-down-9-1'></i> Descending by subtask count
        </MenuItem>
        <MenuItem onClick={() => handleSortBySubtaskMenu('asc-completed')} className='border-top'>
          <i className='fa-solid fa-arrow-down-1-9'></i> Ascending by completed
        </MenuItem>
        <MenuItem onClick={() => handleSortBySubtaskMenu('desc-completed')}>
          <i className='fa-solid fa-arrow-down-9-1'></i> Descending by completed
        </MenuItem>
        <MenuItem onClick={handleClearSortBySubtaskMenu} size='small' className='border-top text-danger'>
          <i className='fa-solid fa-wand-magic-sparkles'></i> Clear sort
        </MenuItem>
      </TableHeaderSort>
    </>
  )
}

export default SortBySubtaskMenu

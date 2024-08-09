import { useSearchParams } from 'react-router-dom'
import { LinearSort, SORT_BY_ASSIGNEES } from '..'
import TableHeaderSort from '../TableHeaderSort'
import MenuItem from '@comps/MenuItem'

function SortByAssigneeCountMenu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleSortBySubtaskMenu = (value: LinearSort) => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.set(SORT_BY_ASSIGNEES, value)
      return newSearchParams
    })
  }
  const handleClearSortBySubtaskMenu = () => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.delete(SORT_BY_ASSIGNEES)
      return newSearchParams
    })
  }
  return (
    <>
      <TableHeaderSort
        header={
          <>
            Assignees&nbsp;{' '}
            {searchParams.get(SORT_BY_ASSIGNEES) ? (
              searchParams.get(SORT_BY_ASSIGNEES) === 'asc' ? (
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
          <i className='fa-solid fa-arrow-down-1-9'></i> Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortBySubtaskMenu('desc')}>
          <i className='fa-solid fa-arrow-down-9-1'></i> Descending
        </MenuItem>
        <MenuItem onClick={handleClearSortBySubtaskMenu} size='small' className='border-top text-danger'>
          <i className='fa-solid fa-wand-magic-sparkles'></i> Clear sort
        </MenuItem>
      </TableHeaderSort>
    </>
  )
}

export default SortByAssigneeCountMenu

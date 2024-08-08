import { useSearchParams } from 'react-router-dom'
import TableHeaderSort from '../TableHeaderSort'
import { LinearSort, SORT_BY_NAME } from '..'
import MenuItem from '@comps/MenuItem'

function SortByNameMenu() {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortByName = (value: LinearSort) => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.set(SORT_BY_NAME, value)
      return newSearchParams
    })
  }
  const handleClearSortByName = () => {
    setSearchParams(prev => {
      const newSearchParams = new URLSearchParams(prev)
      newSearchParams.delete(SORT_BY_NAME)
      return newSearchParams
    })
  }

  return (
    <>
      <TableHeaderSort
        header={
          <>
            Task name&nbsp;{' '}
            {searchParams.get(SORT_BY_NAME) ? (
              searchParams.get(SORT_BY_NAME) === 'asc' ? (
                <i className='fa-solid fa-arrow-down-a-z'></i>
              ) : (
                <i className='fa-solid fa-arrow-up-a-z'></i>
              )
            ) : (
              <i className='fa-solid fa-sort'></i>
            )}
          </>
        }
      >
        <MenuItem onClick={() => handleSortByName('asc')}>
          <i className='fa-solid fa-arrow-down-a-z'></i> Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortByName('desc')}>
          <i className='fa-solid fa-arrow-up-a-z'></i> Descending
        </MenuItem>
        <MenuItem onClick={handleClearSortByName} size='small' className='border-top text-danger'>
          <i className='fa-solid fa-wand-magic-sparkles'></i> Clear sort
        </MenuItem>
      </TableHeaderSort>
    </>
  )
}

export default SortByNameMenu

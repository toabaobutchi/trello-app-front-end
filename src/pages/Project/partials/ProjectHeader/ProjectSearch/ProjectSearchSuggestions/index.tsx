import Flex from '@comps/StyledComponents'
import { useProjectSelector } from '@hooks/useProjectSelector'
import useSubNavigate from '@hooks/useSubNavigate'
import useTasks from '@hooks/useTasks'
import { filterBySearchName } from '@utils/functions'
import { AssignmentResponse, TaskResponseForBoard } from '@utils/types'
import { useDeferredValue, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

type ProjectSearchSuggestionsProps = {
  searchText: string
  searchObject: string
  lostFocus: boolean
}

function ProjectSearchSuggestions({ searchText, searchObject, lostFocus }: ProjectSearchSuggestionsProps) {
  const tasks = useTasks()
  const { members } = useProjectSelector()
  const deferrSearchText = useDeferredValue(searchText)
  const [navigate, location] = useSubNavigate()
  const { pathname } = location
  const suggestions = useMemo(() => {
    switch (searchObject) {
      case 'task':
        return filterBySearchName(tasks, ['name'], deferrSearchText)
      case 'assignee':
        return filterBySearchName(members, ['displayName', 'email'], deferrSearchText)
      default:
        return []
    }
  }, [deferrSearchText, members, searchObject, tasks])
  return (
    <>
      {!lostFocus && (
        <div className={`project-search-suggestions ${deferrSearchText && 'open'}`}>
          {suggestions.length <= 0 && <p className='suggestion-item text-secondary'>No result</p>}
          {searchObject === 'task' &&
            (suggestions as TaskResponseForBoard[])?.map(item => (
              <NavLink to={`${pathname}/task/${item.id}`} className='suggestion-item'>
                <div
                  className={`suggestion-info suggestion-info-${searchObject} suggestion-info-${searchObject}__${
                    item.priority?.toLowerCase() || ''
                  }`}
                >
                  <p>{item.name}</p>
                  <p>{item.priority || 'Not set'}</p>
                </div>
              </NavLink>
            ))}
          {searchObject === 'assignee' &&
            (suggestions as AssignmentResponse[])?.map(item => (
              <NavLink to={`${pathname}/members`} className='suggestion-item'>
                <div className={`suggestion-info`}>
                  <p>{item.displayName}</p>
                  <p>{item.email || 'Not set'}</p>
                </div>
              </NavLink>
            ))}
        </div>
      )}
    </>
  )
}

export default ProjectSearchSuggestions

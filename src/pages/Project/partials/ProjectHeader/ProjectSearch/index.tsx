import SelectList from '@comps/SelectList'
import './ProjectSearch.scss'
import { useDeferredValue, useEffect, useState } from 'react'
import Flex from '@comps/StyledComponents/Flex'
import useTasks from '@hooks/useTasks'
import { AssignmentResponse, TaskResponseForBoard } from '@utils/types'

function ProjectSearch() {
  return (
    <>
      <ProjectSearchInput />
    </>
  )
}
const items = [
  { value: 'task', display: '@task' },
  { value: 'assignee', display: '@assignee' }
]

function ProjectSearchInput() {
  const [searchObject, setSearchObject] = useState(items[0].value)
  const [quickSelectObject, setQuickSelectObject] = useState<string>()
  const [searchInput, setSearchInput] = useState('')
  const input = useDeferredValue(searchInput)
  const tasks = useTasks()
  const [suggestions, setSuggestions] = useState<TaskResponseForBoard[] | AssignmentResponse[]>()
  const handleChooseSearchObject = ({ value }: { value: string }) => {
    setSearchObject(value)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value && value.startsWith('@')) {
      const displayTexts = items.map(i => i.display)
      if (displayTexts.includes(value)) {
        setSearchObject(value.slice(1))
        setQuickSelectObject(value.slice(1))
        value = ''
      }
    }
    setSearchInput(value)
  }
  useEffect(() => {
    const handleSearch = () => {
      if (searchObject === 'task') {
        setSuggestions(tasks?.filter(t => t.name.includes(input.toLowerCase())))
      }
    }
    if (input) handleSearch()
  }, [input])
  return (
    <>
      <div className='posr'>
        <Flex $alignItem='center' className='project-search-container'>
          <SelectList
            size='small'
            items={items}
            manualSelectedValue={quickSelectObject}
            onChoose={handleChooseSearchObject}
            selectedValue={searchObject}
          />
          <input
            type='text'
            className='project-search-input'
            placeholder='Search for projects'
            value={searchInput}
            onChange={handleInputChange}
          />
        </Flex>
        <div className={`project-search-suggestions ${searchInput && 'open'}`}>
          {suggestions?.map(item => (
            <p>{item?.name}</p>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProjectSearch

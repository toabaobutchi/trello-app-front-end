import SelectList from '@comps/SelectList'
import Flex from '@comps/StyledComponents/Flex'
import useClickTracker from '@hooks/useClickTracker'
import { useEffect, useRef, useState } from 'react'
import './ProjectSearch.scss'
import ProjectSearchSuggestions from './ProjectSearchSuggestions'

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
  const [lostFocus, setLostFocus] = useState(true)

  const handleChooseSearchObject = ({ value }: { value: string }) => {
    if (value === 'task' || value === 'assignee') {
      setSearchObject(value)
      setQuickSelectObject(undefined) // reset manual selection
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value && value.startsWith('@')) {
      const displayTexts = items.map(i => i.display)
      if (displayTexts.includes(value)) {
        const sliceValue = value.slice(1)
        if (sliceValue === 'task' || sliceValue === 'assignee') {
          setSearchObject(sliceValue)
          setQuickSelectObject(sliceValue)
          value = ''
        }
      }
    }
    setSearchInput(value)
  }
  const trackedElement = useRef<HTMLDivElement>(null)
  const { outClick } = useClickTracker<HTMLDivElement>(trackedElement?.current)
  useEffect(() => {
    if (outClick.isOutClick && !lostFocus) {
      setLostFocus(true)
    }
    // else setLostFocus(false)
  }, [outClick])
  const handleFocus = () => {
    setLostFocus(false)
  }
  return (
    <>
      <div className='posr flex-1' ref={trackedElement}>
        <Flex $alignItem='center' className='project-search-container'>
          <SelectList
            size='small'
            items={items}
            manualSelectedValue={quickSelectObject}
            onChoose={handleChooseSearchObject}
            selectedValue={searchObject}
            className={`${lostFocus ? 'blur' : 'focused'}`}
          />
          <input type='text' className='project-search-input' placeholder='Search for projects' value={searchInput} onChange={handleInputChange} onFocus={handleFocus} />
        </Flex>
        {searchInput && !searchInput.startsWith('@') && <ProjectSearchSuggestions searchText={searchInput} searchObject={searchObject} lostFocus={lostFocus} />}
      </div>
    </>
  )
}

export default ProjectSearch

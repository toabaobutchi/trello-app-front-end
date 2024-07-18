import MultipleSelectList from '@comps/MultipleSelectList'
import Flex from '@comps/StyledComponents/Flex'
import { roles } from '@utils/objects'

function ProjectMemberFilter() {
  return (
    <>
      <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap' className='member-filters mb-1'>
        <Flex $alignItem='center' $gap='0.25rem'>
          <label htmlFor='status-filter-option'>Status</label>
          <select id='status-filter-option'>
            <option value='all'>All</option>
            <option value='online'>Online</option>
            <option value='offline'>Offline</option>
          </select>
        </Flex>
        <Flex $alignItem='center' $gap='0.25rem'>
          <p>Permission</p>
          <MultipleSelectList items={roles} />
        </Flex>
      </Flex>
    </>
  )
}

export default ProjectMemberFilter

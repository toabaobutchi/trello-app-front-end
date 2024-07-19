import MultipleSelectList from '@comps/MultipleSelectList'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import { roles } from '@utils/objects'

function ProjectMemberFilter() {
  return (
    <>
      <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap' className='member-filters mb-1'>
        <Flex $alignItem='center' $gap='0.25rem'>
          <SwitchButton inputAttributes={{ id: 'online-filter-option', type: 'checkbox' }} />
          <label htmlFor='online-filter-option' className='cpointer'>Active members</label>
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

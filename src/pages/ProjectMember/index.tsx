import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents/Flex'
import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './ProjectMember.scss'
import Button from '@comps/Button'
import Tooltip from '@comps/Tooltip-v2'
import MultipleSelectList from '@comps/MultipleSelectList'
import { roles } from '@utils/objects'
import ProjectMemberFilter from './ProjectMemberFilter'
import ProjectMemberItem from './ProjectMemberItem'

function ProjectMember() {
  const navigate = useNavigate()
  const { members: projectMembers, onlineMembers } = useSelector((state: RootState) => state.project.activeProject)
  const handleClose = () => {
    navigate('..')
  }
  return (
    <>
      <Modal
        open
        onClose={handleClose}
        layout={{
          header: {
            title: 'Project members',
            closeIcon: true
          }
        }}
      >
        {/* <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap' className='member-filters mb-1'>
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
        </Flex> */}
        <ProjectMemberFilter />
        {/* Render project members */}
        {projectMembers.map(member => (
          <ProjectMemberItem key={member.id} member={member} />
        ))}
      </Modal>
    </>
  )
}

export default ProjectMember

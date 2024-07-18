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
        {projectMembers.map(member => {
          const isOnline = onlineMembers?.includes(member?.id)
          return (
            <Flex $alignItem='center' $gap='1rem' key={member.id} className='member-info-row'>
              <div className={`member-info-avatar`}>
                <img src={member.avatar} alt='avatar' />
              </div>
              <div className='member-info-name'>
                <p className='row gap-1'>
                  {member?.displayName} {isOnline && <span className='active-text'>{isOnline ? 'Active' : ''}</span>}
                </p>
                <p className='text-secondary'>{member?.email}</p>
              </div>
              <div className='member-info-permission'>{member?.permission}</div>
              <Flex $alignItem='center' $gap='0.5rem' className='member-info-actions'>
                <Tooltip content='Kick the member out' arrow delay='0.5s'>
                  <Button variant='text' theme='danger'>
                    <i className='fa-solid fa-arrow-right-from-bracket'></i>
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
          )
        })}
      </Modal>
    </>
  )
}

export default ProjectMember

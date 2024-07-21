import Modal from '@comps/Modal'
import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './ProjectMember.scss'
import ProjectMemberFilter from './ProjectMemberFilter'
import ProjectMemberItem from './ProjectMemberItem'

function ProjectMember() {
  const navigate = useNavigate()
  const { members: projectMembers } = useSelector((state: RootState) => state.project.activeProject)
  const handleClose = () => {
    navigate(-1)
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
        <ProjectMemberFilter />
        {projectMembers.map(member => (
          <ProjectMemberItem key={member.id} member={member} />
        ))}
      </Modal>
    </>
  )
}

export default ProjectMember

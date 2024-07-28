import { getDateString } from '@utils/functions'
import { InvitedProjectResponse } from '@utils/types'
import './InvitedProjectCard.scss'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents'
import { handleInvitation } from '@services/invitation.services'
import { useNavigate } from 'react-router-dom'
import { linkCreator } from '@routes/router'

function InvitedProjectCard({
  invitedProject,
  handleRejectProject = () => {}
}: {
  invitedProject: InvitedProjectResponse
  handleRejectProject: (rejectedProjectId: string) => void
}) {
  const navigate = useNavigate()
  const handleAccept = async () => {
    const res = await handleInvitation(invitedProject.invitationId, 'accept')
    if (res?.isSuccess) {
      navigate(
        linkCreator.project({
          viewMode: 'board',
          projectId: invitedProject.id,
          slug: invitedProject.slug,
          ownerShip: invitedProject.invitedPermission
        })
      )
    }
  }
  const handleReject = async () => {
    // chinh sua kieu response cho ham service
    const res = await handleInvitation(invitedProject.invitationId, 'reject')
    handleRejectProject(invitedProject.id)
  }
  return (
    <>
      <div className='invited-project-card-container'>
        <div className='invited-project-card-header'>
          <h3>{invitedProject.name}</h3>
        </div>
        <div className='invited-project-card-body'>
          <p>
            <b>Description:</b> {invitedProject.description}
          </p>
          <p>
            <b>Created at:</b> {getDateString(new Date(invitedProject.createdAt), true)}
          </p>
          <p>
            <b>Due date:</b>{' '}
            {invitedProject.dueDate ? (
              getDateString(new Date(invitedProject.createdAt), true)
            ) : (
              <span className='text-secondary'>[Not set]</span>
            )}
          </p>
          <p>
            <b>Invite sent at:</b> {getDateString(new Date(invitedProject.invitedAt), true)}
          </p>
          <p>
            <b>Inviter:</b> {invitedProject.inviterEmail}
          </p>
          <p>
            You were invited as <b>{invitedProject.invitedPermission}</b>
          </p>
        </div>
        <Flex $alignItem='center' $justifyContent='end' $gap='0.5rem' className='invited-project-card-footer mt-1'>
          <Button onClick={handleAccept} variant='filled'>
            <i className='fa-solid fa-handshake-simple'></i> Accept
          </Button>
          <Button onClick={handleReject} variant='filled' theme='danger'>
            <i className='fa-regular fa-thumbs-down'></i> Reject
          </Button>
        </Flex>
      </div>
    </>
  )
}

export default InvitedProjectCard

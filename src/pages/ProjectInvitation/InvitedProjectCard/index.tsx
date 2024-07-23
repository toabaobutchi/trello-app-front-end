import { getDateString } from '@utils/functions'
import { InvitedProjectResponse } from '@utils/types'
import './InvitedProjectCard.scss'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents'
import HttpClient from '@utils/HttpClient'

const http = new HttpClient()

function InvitedProjectCard({ invitedProject }: { invitedProject: InvitedProjectResponse }) {
  const handleInvitation = async (action: 'accept' | 'reject') => {
    const res = await http.postAuth(`/invitations/${invitedProject.invitationId}/${action}`, {})
    return res
  }
  const handleAccept = async () => {
    const res = await handleInvitation('accept')
    console.log(res)
  }
  const handleReject = async () => {
    const res = await handleInvitation('reject')
    console.log(res)
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
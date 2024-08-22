import './ProjectInvitation.scss'
import { useLoaderData } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { InvitedProjectResponse } from '@utils/types/project.type'
import InvitedProjectCard from './InvitedProjectCard'
import Flex from '@comps/StyledComponents'
import emptyInvitationImagePage from '@assets/empty_invitation.jpg'
import { useState } from 'react'

function ProjectInvitation() {
  const res = useLoaderData() as AxiosResponse
  const data = res?.data as InvitedProjectResponse[]
  const [invitedProjects, setInvitedProjects] = useState<InvitedProjectResponse[]>(
    data.sort(i => -1 * i.createdAt) ?? []
  )
  const handleReject = (rejectedProjectId: string) => {
    setInvitedProjects(prev => prev.filter(p => p.id !== rejectedProjectId))
  }
  return (
    <>
      {data && data.length > 0 && (
        <div className='invited-project-container'>
          {invitedProjects.map(item => (
            <InvitedProjectCard key={item.id} invitedProject={item} handleRejectProject={handleReject} />
          ))}
        </div>
      )}
      {!data ||
        (data.length <= 0 && (
          <Flex
            $alignItem='center'
            $gap='1rem'
            $flexDirection='column'
            $justifyContent='center'
            className='w-full h-full empty-invitations'
          >
            <img src={emptyInvitationImagePage} alt='logo empty page' />
            <p className='text-info bold empty-invitations-message'>You are not having any invitation</p>
          </Flex>
        ))}
    </>
  )
}

export default ProjectInvitation

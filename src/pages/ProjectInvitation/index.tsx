import './ProjectInvitation.scss'
import { useLoaderData } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import HttpClient from '@utils/HttpClient'
import { InvitedProjectResponse } from '@utils/types'
import InvitedProjectCard from './InvitedProjectCard'
import Flex from '@comps/StyledComponents'
import emptyInvitationImagePage from '@assets/empty_invitation.jpg'

const http = new HttpClient()

function ProjectInvitation() {
  const res = useLoaderData() as AxiosResponse
  let data = res?.data as InvitedProjectResponse[]
  data = data.sort(i => -1 * i.createdAt)
  return (
    <>
      {data && data.length > 0 && (
        <div className='invited-project-container'>
          {data.map(item => (
            <InvitedProjectCard key={item.id} invitedProject={item} />
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

import './ProjectInvitation.scss'
import { useLoaderData } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import HttpClient from '@utils/HttpClient'
import { InvitedProjectResponse } from '@utils/types'
import InvitedProjectCard from './InvitedProjectCard'

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
      {!data || (data.length <= 0 && <p className='text-info'>You do not have any invitation!</p>)}
    </>
  )
}

export default ProjectInvitation

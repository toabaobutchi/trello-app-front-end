import Button from '@comps/Button'
import './ProjectInvitation.scss'
import Flex from '@comps/StyledComponents/Flex'
import { useLoaderData, useLocation, useSearchParams } from 'react-router-dom'
import { Project } from '@utils/types'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import HttpClient from '@utils/HttpClient'

const http = new HttpClient()

type Inviter = {
  email: string
  displayName?: string
}

function ProjectInvitation() {
  const res = useLoaderData() as AxiosResponse
  const [inviter, setInviter] = useState<Inviter>()
  const queryParams = useMemo(() => new URLSearchParams(location.search), [])
  const project = res?.data as Project
  console.log(location.search)
  console.log(queryParams)
  useEffect(() => {
    http.get(`/projects/${project.id}/inviter/${queryParams.get('inviter')}`).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        setInviter(res?.data)
      }
    })
  }, [project.id, queryParams])
  if (res?.status !== HttpStatusCode.Ok) {
    return <>Something went wrong</>
  }
  return (
    <>
      <div className='project-invitation'>
        <div className='project-invitation-card'>
          <div className='project-invitation-card-header' content={project?.dueDate?.toString()}>
            {project?.name}
          </div>
          <div className='project-invitation-card-body'>
            <div className='project-invitation-card-body-description'>{project.description}</div>
            <div className='project-invitation-card-body-inviter'>
              <p className='text-primary'>Lời mời từ:</p>{' '}
              <strong>
                {inviter?.displayName} ({inviter?.email})
              </strong>
            </div>
          </div>
          <Flex $alignItem='center' $justifyContent='end' style={{ marginTop: '2rem' }}>
            <Button variant='filled' size='large'>
              <i className='fa-solid fa-check'></i> Accept
            </Button>
          </Flex>
        </div>
      </div>
    </>
  )
}

export default ProjectInvitation

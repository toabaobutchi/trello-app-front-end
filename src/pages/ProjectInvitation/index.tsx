import Button from '@comps/Button'
import './ProjectInvitation.scss'
import Flex from '@comps/StyledComponents/Flex'
import { useLoaderData } from 'react-router-dom'
import { Project } from '@utils/types'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import HttpClient from '@utils/HttpClient'
import { GoogleLogin } from '@react-oauth/google'
// import appLogo from '@assets/trello_pic.png'
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
  const uid = queryParams.get('uid')
  useEffect(() => {
    http.get(`/projects/${project?.id}/inviter/${queryParams.get('inviter')}`).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        setInviter(res?.data)
      }
    })
  }, [project?.id, queryParams])

  const handleAcceptInvitation = () => {}

  if (res?.status !== HttpStatusCode.Ok) {
    return <>Something went wrong</>
  }

  const handleLogin = (code?: string) => {
    http.post(`/register/invitation/p/${project.id}/piid/${queryParams.get('pi')}`, { credentials: code }).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        console.log(res?.data)
      } else {
        console.log('Can not accept invitation', res?.data)
      }
    })
  }

  return (
    <>
      <div className='project-invitation'>
        {/* <img src={appLogo} alt='app logo' /> */}
        <div className='project-invitation-card'>
          <div className='project-invitation-card-header' content={new Date(project?.dueDate as number).toDateString()}>
            {project?.name}
          </div>
          <div className='project-invitation-card-body'>
            <div className='project-invitation-card-body-description'>{project.description}</div>
            <div className='project-invitation-card-body-inviter'>
              <p className='text-primary'>Invitation from: </p>{' '}
              <strong>
                {inviter?.displayName} ({inviter?.email})
              </strong>
            </div>
          </div>
          <Flex $alignItem='center' $justifyContent='end' style={{ marginTop: '2rem' }}>
            {uid ? (
              <Button onClick={handleAcceptInvitation} variant='filled' size='large'>
                <i className='fa-solid fa-check'></i> Accept & Join
              </Button>
            ) : (
              <GoogleLogin onSuccess={credentials => handleLogin(credentials.credential)} />
            )}
          </Flex>
        </div>
      </div>
    </>
  )
}

export default ProjectInvitation

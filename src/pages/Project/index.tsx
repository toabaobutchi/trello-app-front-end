/* eslint-disable react-hooks/exhaustive-deps */
import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import ProjectHeader from './partials/ProjectHeader'
// import BoardContent from './partials/BoardContent'
import { ProjectPageParams } from '@utils/types'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { HttpStatusCode } from 'axios'
import { RootState } from '@redux/store'
import HttpClient from '@utils/HttpClient'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import config from '@confs/app.config'
import TableContent from './partials/TableContent'
import LoadingLayout from '@layouts/LoadingLayout'

const BoardContent = lazy(() => import('./partials/BoardContent'))

const http = new HttpClient()

function Project() {
  const params = useParams() as ProjectPageParams
  //TODO Tuy vao viewmode ma lay ra du lieu can thiet
  const project = useSelector((state: RootState) => state.project.activeProject.board)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  const dispatch = useDispatch()
  const [projectConnection, setProjectConnection] = useState<HubConnection>()

  useEffect(() => {
    if (!project || project?.id !== params.projectId) {
      http.getAuth(`/v2/projects/${params.projectId}/v/${params.viewMode}`).then(res => {
        if (res?.status === HttpStatusCode.Ok) {
          dispatch(projectSlice.actions.setActiveProjectBoard(res?.data))
        }
      })
    }
  }, [params?.projectId])

  useEffect(() => {
    if (project) {
      const connection = new HubConnectionBuilder().withUrl(`${config.baseUrl}/projectHub`).build()
      connection
        .start()
        .then(() => {
          setProjectConnection(connection)
          // dispatch(hubConnectionSlice.actions.setHubConnection(connection))
          connection.invoke('SubscribeProject', project?.id, account?.id)
        })
        .catch(err => console.log(err))
    }

    return () => {
      if (projectConnection) {
        projectConnection.stop()
      }
    }
  }, [])

  useEffect(() => {
    if (projectConnection) {
      projectConnection.on('ReceiveSubscriber', (assignmentIds: string[]) => {
        dispatch(projectSlice.actions.setOnlineMembers(assignmentIds))
      })
    }
  }, [projectConnection])

  useEffect(() => {
    // tải thành viên của project
    http.getAuth(`/assignments/in-project/${project?.id}`).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        dispatch(projectSlice.actions.setProjectMembers(res.data))
      } else {
        console.log('Can not get project members', res?.data)
      }
    })
  }, [project?.id])
  return (
    <>
      {project && (
        <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
          <ProjectHeader />
          <Suspense
            fallback={
              <>
                <LoadingLayout className='row jcc' style={{ width: '100%', height: '100%' }} isLoading />
              </>
            }
          >
            {project && params.viewMode === 'board' && <BoardContent />}
          </Suspense>

          {project && params.viewMode === 'table' && <TableContent />}
        </Flex>
      )}
    </>
  )
}

export default Project

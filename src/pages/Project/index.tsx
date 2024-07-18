import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import ProjectHeader from './partials/ProjectHeader'
import { ProjectPageParams } from '@utils/types'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { HttpStatusCode } from 'axios'
import { RootState } from '@redux/store'
import HttpClient from '@utils/HttpClient'
import TableContent from './partials/TableContent'
import LoadingLayout from '@layouts/LoadingLayout'
import { hubs, ProjectHub } from '@utils/Hubs'

const BoardContent = lazy(() => import('./partials/BoardContent'))

const http = new HttpClient()

function Project() {
  const params = useParams() as ProjectPageParams
  //TODO Tuy vao viewmode ma lay ra du lieu can thiet
  const activeProject = useSelector((state: RootState) => state.project.activeProject)
  const { board: project, members } = activeProject
  const dispatch = useDispatch()
  const [projectHub] = useState<ProjectHub>(new ProjectHub())

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
    if (project?.id && project?.id === params.projectId) {
      if (!projectHub.isConnected) {
        projectHub.connection
      }
    }

    return () => {
      if (projectHub.isConnected && project?.id && project?.id === params.projectId) {
        projectHub.disconnect()
      }
    }
  }, [project?.id])

  useEffect(() => {
    if (projectHub.isConnected && project?.id && project.id === params.projectId) {
      // ReceiveSubscriber
      projectHub.connection?.on(hubs.project.receive.subscriber, (assignmentIds: string[]) => {
        dispatch(projectSlice.actions.setOnlineMembers(assignmentIds))
      })
    }
  }, [projectHub.isConnected, project.id, projectHub.connection, params.projectId, dispatch])

  useEffect(() => {
    // tải thành viên của project
    if (project?.id && project.id === params.projectId)
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
            {project?.id && project.id === params.projectId && params.viewMode === 'board' && <BoardContent />}
          </Suspense>

          {project && params.viewMode === 'table' && <TableContent />}
          {members.length > 0 && <Outlet />}
        </Flex>
      )}
    </>
  )
}

export default Project

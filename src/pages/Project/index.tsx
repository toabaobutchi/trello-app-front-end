import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import ProjectHeader from './partials/ProjectHeader'
import { ProjectPageParams } from '@utils/types'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { HttpStatusCode } from 'axios'
import HttpClient from '@utils/HttpClient'
import TableContent from './partials/TableContent'
import LoadingLayout from '@layouts/LoadingLayout'
import { hubs, ProjectHub } from '@utils/Hubs'
import { useProjectSelector } from '@hooks/useProjectSelector'
import ProjectSideBar from './partials/ProjectSideBar'

const BoardContent = lazy(() => import('./partials/BoardContent'))

const http = new HttpClient()

function Project() {
  const params = useParams() as ProjectPageParams
  const { board: project } = useProjectSelector()
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
    if (project && project.id && project.id === params.projectId) {
      if (!projectHub.isConnected) {
        projectHub.connection // kết nối đến hub
      }
    }

    return () => {
      if (projectHub.isConnecting && project?.id && project?.id === params.projectId) {
        projectHub.disconnect()
      }
    }
  }, [project?.id])

  useEffect(() => {
    if (projectHub.isConnected) {
      projectHub.connection?.on(hubs.project.receive.onlineMembers, (assignmentIds: string[]) => {
        dispatch(projectSlice.actions.setOnlineMembers(assignmentIds))
      })
      projectHub.connection?.invoke(hubs.project.send.getOnlineMembers).catch(_ => {})
    }
  }, [project, project?.id, projectHub.isConnected])

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
            <Flex>
              <ProjectSideBar />
              {project?.id && project.id === params.projectId && params.viewMode === 'board' && <BoardContent />}
            </Flex>
          </Suspense>

          {project && params.viewMode === 'table' && <TableContent />}
          <Outlet />
        </Flex>
      )}
    </>
  )
}

export default Project

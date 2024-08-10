import './Project.scss'
import Flex from '@comps/StyledComponents/Flex'
import ProjectHeader from './partials/ProjectHeader'
import { ProjectPageParams, ProjectResponseForBoard } from '@utils/types'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLoaderData, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import LoadingLayout from '@layouts/LoadingLayout'
import { hubs, ProjectHub } from '@utils/Hubs'
import { useProjectSelector } from '@hooks/useProjectSelector'
import ProjectSideBar from './partials/ProjectSideBar'
import { getAssignmentsInProject } from '@services/assignment.services'
import { HttpResponse } from '@utils/Axios/HttpClientAuth'
import ProjectChatRoom from './partials/ProjectChatRoom'

function Project() {
  const params = useParams() as ProjectPageParams
  const { board: project } = useProjectSelector()
  const response = useLoaderData() as HttpResponse<ProjectResponseForBoard>
  const dispatch = useDispatch()
  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!project || project?.id !== params.projectId) {
      if (response?.isSuccess) {
        const data = response.data
        dispatch(projectSlice.actions.setActiveProjectBoard(data))

        // sau khi tải dữ liệu thì khởi tạo kết nối thời gian thực
        projectHub.connectToHub(() => {
          setIsConnected(_prev => true)
        }) // kết nối đến hub
      }
    }
    return () => {
      setIsConnected(_prev => false)
    }
  }, [params?.projectId])

  useEffect(() => {
    if (projectHub.isConnected) {
      projectHub.connection?.on(hubs.project.receive.onlineMembers, (assignmentIds: string[]) => {
        dispatch(projectSlice.actions.setOnlineMembers(assignmentIds))
      })
      projectHub.connection?.invoke(hubs.project.send.getOnlineMembers).catch(_ => {})
    }
  }, [project?.id, projectHub.isConnected])

  useEffect(() => {
    // tải thành viên của project
    if (project?.id && project.id === params.projectId)
      getAssignmentsInProject(project.id).then(res => {
        if (res?.isSuccess) {
          dispatch(projectSlice.actions.setProjectMembers(res.data))
        } else {
          console.log('Can not get project members', res?.data)
        }
      })
  }, [project?.id, params.projectId])
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
            <Flex className='w-full flex-1' style={{ overflow: 'hidden' }} $gap='0.5rem'>
              <ProjectSideBar />
              {isConnected && <Outlet />}
            </Flex>
          </Suspense>
          <ProjectChatRoom />
        </Flex>
      )}
    </>
  )
}

export default Project

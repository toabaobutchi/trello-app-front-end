import { useProjectSelector } from '@hooks/useProjectSelector'
import { projectSlice } from '@redux/ProjectSlice'
import { ProjectPageParams, ProjectResponseForBoard } from '@utils/types'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLoaderData, useParams } from 'react-router-dom'
import BoardContent from '../BoardContent'
import TableContent from '../TableContent'
// import HttpClient from '@utils/HttpClient'

// const http = new HttpClient()

function ViewContent() {
  // const response = useLoaderData() as AxiosResponse
  const params = useParams() as ProjectPageParams
  const { board: project } = useProjectSelector()
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   if (!project || project?.id !== params.projectId) {
  //     if (response?.status === HttpStatusCode.Ok) {
  //       const data = response?.data as ProjectResponseForBoard
  //       dispatch(projectSlice.actions.setActiveProjectBoard(data))
  //     }
  //   }
  // }, [params?.projectId])

  // useEffect(() => {
  //   if (!project?.id || project?.id !== params.projectId) {
  //     http.getAuth(`/v2/projects/${params.projectId}/v/${params.viewMode}`).then(res => {
  //       if (res?.status === HttpStatusCode.Ok) {
  //         dispatch(projectSlice.actions.setActiveProjectBoard(res?.data))
  //       }
  //     })
  //   }
  // }, [params?.projectId])
  return (
    <>
      {project?.id && project.id === params.projectId && (
        <>
          {params.viewMode === 'board' && <BoardContent />}
          {params.viewMode === 'table' && <TableContent />}
        </>
      )}
      <Outlet />
    </>
  )
}

export default ViewContent

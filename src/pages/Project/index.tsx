/* eslint-disable react-hooks/exhaustive-deps */
import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import ProjectHeader from './partials/ProjectHeader'
import BoardContent from './partials/BoardContent'
import { ProjectResponseForBoard } from '@utils/types'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { RootState } from '@redux/store'
import HttpClient from '@utils/HttpClient'

const http = new HttpClient()

function Project() {
  const loader = useLoaderData() as AxiosResponse
  const project = useSelector((state: RootState) => state.project.activeProject.board)
  const boardData = loader.data as ProjectResponseForBoard
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(projectSlice.actions.setActiveProjectBoard(boardData))
  }, [boardData, dispatch])

  useEffect(() => {
    // tải thành viên của project
    http.getAuth(`/assignments/in-project/${boardData.id}`).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        console.log(res?.data ?? 'Success but nothing')
        dispatch(projectSlice.actions.setProjectMembers(res.data))
      } else {
        console.log('Can not get project members', res?.data)
      }
    })
  }, [])

  return (
    <>
      {boardData && (
        <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
          <ProjectHeader />
          {project && project.lists?.length && <BoardContent lists={project?.lists} />}
        </Flex>
      )}
    </>
  )
}

export default Project

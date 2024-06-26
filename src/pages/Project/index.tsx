import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import ProjectHeader from './partials/ProjectHeader'
import BoardContent from './partials/BoardContent'
import { ProjectResponseForBoard } from '@utils/types'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { AxiosResponse } from 'axios'
import { RootState } from '@redux/store'

function Project() {
  const loader = useLoaderData() as AxiosResponse
  const project = useSelector((state: RootState) => state.project.activeProject.board)
  const boardData = loader.data as ProjectResponseForBoard
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(projectSlice.actions.setActiveProjectBoard(boardData))
  }, [boardData, dispatch])
  return (
    <>
      {boardData && (
        <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
          <ProjectHeader />
          {project && <BoardContent lists={project?.lists} />}
        </Flex>
      )}
    </>
  )
}

export default Project

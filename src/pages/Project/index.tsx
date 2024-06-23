import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import ProjectHeader from './partials/ProjectHeader'
import BoardContent from './partials/BoardContent'
import { ListForBoard, ProjectForBoard } from '@utils/types'
import projectData from '@fake/board.data'
import { useEffect, useState } from 'react'

function Project() {
  // const boardData = useLoaderData() as ProjectForBoard
  const [boardData, setBoardData] = useState<ProjectForBoard>();
  useEffect(() => {
    projectData.then((data) => setBoardData(data))
  })
  return (
    <>
      {boardData && (
        <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
          <ProjectHeader boardName={boardData.name} />
          <BoardContent lists={boardData.lists as ListForBoard[]} />
        </Flex>
      )}
    </>
  )
}

export default Project

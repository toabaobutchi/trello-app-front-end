import { useProjectSelector } from '@hooks/useProjectSelector'
import { ProjectPageParams } from '@utils/types'
import { Outlet, useParams } from 'react-router-dom'
import BoardContent from '../BoardContent'
import TableContent from '../TableContent'
function ViewContent() {
  // const response = useLoaderData() as AxiosResponse
  const params = useParams() as ProjectPageParams
  const { board: project } = useProjectSelector()

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

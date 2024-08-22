import { useProjectSelector } from '@hooks/useProjectSelector'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { Outlet, useParams } from 'react-router-dom'
import BoardContent from '../BoardContent'
import TableContent from '../TableContent'
import CalendarContent from '../CalendarContent'
import OverviewContent from '../OverviewContent'
function ViewContent() {
  const params = useParams() as ProjectPageParams
  const { board: project } = useProjectSelector()
  return (
    <>
      {project?.id && project.id === params.projectId && (
        <>
          {params.viewMode === 'board' && <BoardContent />}
          {params.viewMode === 'table' && <TableContent />}
          {params.viewMode === 'calendar' && <CalendarContent />}
          {params.viewMode === 'overview' && <OverviewContent />}
        </>
      )}
      <Outlet />
    </>
  )
}

export default ViewContent

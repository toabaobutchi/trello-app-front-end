import Tooltip from '@comps/Tooltip-v2'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { getColor } from '@utils/functions'

function ListState() {
  const { board: project } = useProjectSelector()
  const total = project.lists?.reduce((sum, list) => sum + (list.tasks?.length ?? 0), 0)
  return (
    <div className='overview-card list-state'>
      <p className='list-state-header'>Lists of cards</p>
      <div className='list-state-hz-line'>
        {project?.lists?.map(list => (
          <Tooltip
            position='top'
            arrow
            style={{ flex: `${list.tasks?.length ?? 0}` }}
            key={list.id}
            content={`${list.name} - ${list.tasks?.length ?? 0}`}
          >
            <div
              style={{ flex: `${list.tasks?.length ?? 0}`, backgroundColor: `${getColor()}` }}
              className='list-state-item'
            ></div>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export default ListState

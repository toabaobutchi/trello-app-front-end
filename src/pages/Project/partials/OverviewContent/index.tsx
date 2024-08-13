import { useProjectSelector } from '@hooks/useProjectSelector'
import './OverviewContent.scss'
import { getDateString } from '@utils/functions'
import ListState from './ListState'
import AssignmentInfo from './AssignmentInfo'
function OverviewContent() {
  const { board: project } = useProjectSelector()
  return (
    <div className='overview-container'>
      <div className='overview-card overview-project'>
        <p className='overview-project-name'>{project?.name}</p>
        <p className='overview-project-creation-time'>
          <b>
            <i className='fa-regular fa-calendar'></i> Created at
          </b>
          : {getDateString(new Date(project.createdAt))}
        </p>
        <p className='overview-project-due-date'>
          <b>
            <i className='fa-regular fa-clock'></i> Due date
          </b>
          :{' '}
          {project?.dueDate ? (
            getDateString(new Date(project.createdAt))
          ) : (
            <span className='text-secondary'>[Not set]</span>
          )}
        </p>
        {/* <p>
          <b>
            <i className='fa-solid fa-layer-group'></i> Workspace:{' '}
          </b>
        </p> */}
      </div>
      <ListState />
      <AssignmentInfo />
    </div>
  )
}

export default OverviewContent

import Flex from '@comps/StyledComponents'
import config from '@confs/app.config'
import { getDateString } from '@utils/functions'
import { ProjectResponseForBoard } from '@utils/types/project.type'

function ProjectHeaderInfo({ project }: { project?: ProjectResponseForBoard }) {
  return (
    <div className='project-header-info'>
      <Flex $alignItem='center' $gap='0.5rem'>
        <p className='page-header project-name'>
          <i className='fa-brands fa-flipboard'></i> {project?.name}
        </p>
        <p className='text-secondary project-info-toggle-button'>
          <i className='fa-solid fa-circle-info'></i>
        </p>
      </Flex>
      <p className='text-secondary' style={{ fontSize: '0.9rem' }}>
        <i className='fa-regular fa-calendar'></i> Due date:{' '}
        {project?.dueDate ? getDateString(new Date(project?.dueDate)) : config.texts.dateNotSet}
      </p>
    </div>
  )
}

export default ProjectHeaderInfo

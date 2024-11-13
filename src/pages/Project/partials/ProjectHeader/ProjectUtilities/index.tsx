import IconButton from '@comps/IconButton'
import Tooltip from '@comps/Tooltip-v2'
import { usePageParams } from '@hooks/usePageParams'
import { linkCreator } from '@routes/router'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { NavLink } from 'react-router-dom'

function ProjectUtilities() {
  const params = usePageParams<ProjectPageParams>()

  return (
    <>
      <Tooltip content='Change logs' position='bottom' arrow>
        <NavLink to={linkCreator.changeLog(params)} className='utils-menu-item'>
          <IconButton shape='square' theme='light'>
            <i className='fa-solid fa-timeline fa-fw'></i>
          </IconButton>
        </NavLink>
      </Tooltip>
      <Tooltip content='Recycle bin' position='bottom' arrow>
        <NavLink to={linkCreator.projectRecycleBin(params)} className='utils-menu-item'>
          <IconButton shape='square' theme='light'>
            <i className='fa-regular fa-trash-can'></i>
          </IconButton>
        </NavLink>
      </Tooltip>
    </>
  )
}

export default ProjectUtilities

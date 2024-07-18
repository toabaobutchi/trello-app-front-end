import Button from '@comps/Button'
import routeLinks from '@routes/router'
import { useLocation, useNavigate } from 'react-router-dom'
// import { RootState } from '@redux/store'
// import { useSelector } from 'react-redux'

function ProjectMembers() {
  // const project = useSelector((state: RootState) => state.project.activeProject)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const handleNavigate = () => {
    navigate(`${pathname}/${routeLinks.members}`)
  }
  return (
    <>
      <Button onClick={handleNavigate}>
        <i className='fa-solid fa-users-line'></i> Members
      </Button>
    </>
  )
}

export default ProjectMembers

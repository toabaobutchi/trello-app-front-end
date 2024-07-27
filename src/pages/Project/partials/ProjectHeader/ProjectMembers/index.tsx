import Button from '@comps/Button'
import routeLinks from '@routes/router'
import { useLocation, useNavigate } from 'react-router-dom'

function ProjectMembers() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const handleNavigate = () => {
    navigate(`${pathname}/${routeLinks.project.members.index}`)
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

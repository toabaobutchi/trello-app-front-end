import Button from '@comps/Button'
import Menu from '@comps/Menu_v2'
import useToggle from '@hooks/useToggle'

function ProjectSort() {
  const [sortAndGroupMenu, toggle] = useToggle()
  return (
    <div className='project-sort'>
      <Button variant='text' id='sort-n-group-btn' theme='light' onClick={toggle}>
        <i className='fa-solid fa-sort' /> Sort & Group
      </Button>
      <Menu anchorId='sort-n-group-btn' open={sortAndGroupMenu} onClose={toggle}>
        Hello
      </Menu>
    </div>
  )
}

export default ProjectSort

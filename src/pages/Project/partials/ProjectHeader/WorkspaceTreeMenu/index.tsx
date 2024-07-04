import Button from '@comps/Button'
import './WorkspaceTreeMenu.scss'
import useMenu from '@hooks/useMenu'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { useEffect } from 'react'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import HttpClient from '@utils/HttpClient'
import { NavLink } from 'react-router-dom'
import { linkCreator } from '@routes/router'

const http = new HttpClient()

// dựa vào dữ liệu của activeWorkspace trong store để sử dụng
function WorkspaceTreeMenu({ workspaceId }: { workspaceId: string }) {
  const menu = useMenu<HTMLButtonElement>()
  const dispatch = useDispatch()
  const activeWorkspace = useSelector((state: RootState) => state.workspaces.activeWorkspace)
  useEffect(() => {
    console.log(activeWorkspace)
    if (!activeWorkspace) {
      // fetch workspace
      http
        .getAuth(`/w/${workspaceId}/projects`)
        .then(workspace => {
          dispatch(workspaceSlice.actions.setActiveWorkspace(workspace))
        })
        .catch(err => {
          console.error('Can not fetch workspace', err)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])
  return (
    <>
      <Button
        ref={menu.anchorRef}
        onClick={menu.toggleMenu}
        className={`${menu.open ? 'click-button__open' : ''}`}
        variant='text'
        theme={`${menu.open ? 'primary' : 'default'}`}
        size='large'
      >
        <i className='fa-solid fa-folder-tree'></i>
      </Button>
      <Menu
        style={{ width: '200px', fontSize: '1.1rem' }}
        onClose={menu.closeMenu}
        open={menu.open}
        anchorElement={menu.anchorRef.current}
      >
        <MenuItem className='row gap-1'>
          <i className='fa-solid fa-flag'></i> {activeWorkspace?.name}
        </MenuItem>
        {activeWorkspace?.projects?.map(project => {
          return (
            <NavLink
              to={linkCreator.project({
                viewMode: 'board',
                projectId: project?.id,
                ownerShip: project?.context?.toLowerCase(),
                slug: project?.slug
              })}
              className={({ isActive }) =>
                isActive ? 'project-nav-link row jcsb current-active' : 'project-nav-link row jcsb'
              }
              key={project.id}
            >
              {project.name}
              <span>
                <i className='fa-regular fa-folder-open active-icon'></i>
              </span>
            </NavLink>
          )
        })}
      </Menu>
    </>
  )
}

export default WorkspaceTreeMenu

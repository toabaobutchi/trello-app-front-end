import Button from '@comps/Button'
import './WorkspaceTreeMenu.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { defaultLayoutSlice } from '@layouts/DefaultLayout/DefaultLayoutSlice'

// dựa vào dữ liệu của activeWorkspace trong store để sử dụng
function WorkspaceTreeMenu() {
  // const menu = useMenu<HTMLButtonElement>()
  const dispatch = useDispatch()
  const projectSidebar = useSelector((state: RootState) => state.sideBar.projectSidebar)
  const handleToggleProjectSidebar = () => {
    dispatch(defaultLayoutSlice.actions.toggleProjectSidebar())
  }
  return (
    <>
      <Button
        onClick={handleToggleProjectSidebar}
        variant='text'
        size='small'
        theme={`${projectSidebar ? 'primary' : 'secondary'}`}
      >
        <i className='fa-solid fa-folder-tree'></i>
      </Button>
    </>
  )
}

export default WorkspaceTreeMenu

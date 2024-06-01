import Expander from '@comps/Expander'
import './SideBar.scss'
import './SideBar.responsive.scss'
import SideBarItem from './partials/SideBarItem'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { defaultLayoutSlice } from '@layouts/DefaultLayout/DefaultLayoutSlice'
import Button from '@comps/Button'

function SideBar() {
  const sideBarStatus = useSelector((state: RootState) => state.sideBar.expand)
  const dispatch = useDispatch()
  const toggleSidebar = () => {
    dispatch(defaultLayoutSlice.actions.toggleSidebar())
  }
  return (
    <>
      <div className={`sidebar-overlay${sideBarStatus ? ' hide' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar${sideBarStatus ? '' : ' collapsed'}`}>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
        <SideBarItem icon={<i className="fa-solid fa-list-check"></i>}>Your tasks</SideBarItem>
        <Expander header='Workspaces'>
          <SideBarItem>Home - Overview</SideBarItem>
          <SideBarItem>Home - Overview</SideBarItem>
          <SideBarItem>Home - Overview</SideBarItem>
        </Expander>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
        <Button
          onClick={toggleSidebar}
          className='sidebar-close-button-on-mobile'
          variant='outlined'
          theme='danger'
          style={{ fontSize: '1.3rem' }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </Button>
      </div>
    </>
  )
}

export default SideBar

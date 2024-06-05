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
        <SideBarItem className='active' icon={<i className='fa-solid fa-house-flag'></i>}>
          Home - Overview
        </SideBarItem>
        <SideBarItem icon={<i className='fa-solid fa-list-check'></i>}>Your tasks</SideBarItem>
        <Expander header={{ content: 'Workspaces', style: { flex: 1 } }} defaultExpand>
          <SideBarItem style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Expander header={{ content: 'Luận văn tốt nghiệp' }} useArrow={false}>
              <SideBarItem>Project 1</SideBarItem>
              <SideBarItem>Project 2</SideBarItem>
            </Expander>
          </SideBarItem>
          <SideBarItem>Phát triển ứng dụng</SideBarItem>
          <SideBarItem>Classroom</SideBarItem>
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
          <i className='fa-solid fa-chevron-left'></i>
        </Button>
      </div>
    </>
  )
}

export default SideBar

import Expander from '@comps/Expander'
import './SideBar.scss'
import SideBarItem from './partials/SideBarItem'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

function SideBar() {
  const sideBarStatus = useSelector((state: RootState) => state.sideBar.expand)
  return (
    <>
      <div className={`sidebar${sideBarStatus ? '': ' collapsed'}`}>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
        <Expander header='Workspaces'>
          <SideBarItem>Home - Overview</SideBarItem>
          <SideBarItem>Home - Overview</SideBarItem>
          <SideBarItem>Home - Overview</SideBarItem>
        </Expander>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
        <SideBarItem icon={<i className='fa-solid fa-house-flag'></i>}>Home - Overview</SideBarItem>
      </div>
    </>
  )
}

export default SideBar

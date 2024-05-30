import Expander from '@comps/Expander'
import './SideBar.scss'
import SideBarItem from './partials/SideBarItem'

function SideBar() {
  return (
    <>
      <div className='sidebar'>
        {/* <SearchInput attributes={{ placeholder: 'Search workspace ...', id: 'workspace-search-input' }} /> */}
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

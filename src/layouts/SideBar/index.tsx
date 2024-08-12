import Expander from '@comps/Expander'
import './SideBar.scss'
import './SideBar.responsive.scss'
import SideBarItem from './partials/SideBarItem'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { defaultLayoutSlice } from '@layouts/DefaultLayout/DefaultLayoutSlice'
import Button from '@comps/Button'
import routeLinks, { linkCreator } from '@routes/router'
import config from '@confs/app.config'
import SharedWorkspaces from './partials/SharedWorkspaces'
import { getSlug } from '@utils/functions'
import AddWorkspace from './partials/AddWorkspace'

function SideBar() {
  const sideBarStatus = useSelector((state: RootState) => state.sideBar.expand)
  const workspaces = useSelector((state: RootState) => state.workspaces)
  const dispatch = useDispatch()
  const toggleSidebar = () => {
    dispatch(defaultLayoutSlice.actions.toggleSidebar())
  }
  const closeSidebarWhenRedirectInMobileMode = () => {
    if (window.innerWidth <= config.sideBar.startMobileMode.width) {
      dispatch(defaultLayoutSlice.actions.toggleSidebar())
    }
  }
  return (
    <>
      <div className={`sidebar-overlay${sideBarStatus ? ' hide' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar${sideBarStatus ? '' : ' collapsed'}`}>
        <SideBarItem.Link to={routeLinks.home} onClick={closeSidebarWhenRedirectInMobileMode}>
          <i className='fa-solid fa-house-flag'></i> Home - Overview
        </SideBarItem.Link>
        {/* <SideBarItem.Link to={routeLinks.yourTasks} onClick={closeSidebarWhenRedirectInMobileMode}>
          <i className='fa-solid fa-list-check'></i> Your tasks
        </SideBarItem.Link> */}
        <SideBarItem style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Expander
            header={{
              content: (
                <>
                  <i className='fa-regular fa-folder-open'></i> Workspaces
                </>
              ),
              style: { flex: 1 }
            }}
            defaultExpand
          >
            <SideBarItem style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Expander
                header={{
                  content: (
                    <p>
                      <i className='fa-solid fa-cloud'></i> Your workspaces
                    </p>
                  )
                }}
                defaultExpand
              >
                {workspaces.workspaceList?.map(workspace => {
                  const path = linkCreator.workspaces({
                    slug: getSlug(workspace.slug),
                    workspaceId: workspace.id + '',
                    ownerShip: workspace.context
                  })
                  return (
                    <SideBarItem.Link to={path} key={workspace?.id}>
                      <i className='fa-solid fa-layer-group'></i> {workspace.name}
                    </SideBarItem.Link>
                  )
                })}
                {(!workspaces.workspaceList || workspaces.workspaceList?.length <= 0) && (
                  <>
                    <AddWorkspace />
                  </>
                )}
              </Expander>
            </SideBarItem>
            <SharedWorkspaces />
          </Expander>
        </SideBarItem>
        <SideBarItem.Link to={routeLinks.projectInvitation}>
          <i className='fa-solid fa-envelope sidebar-close-icon'></i>{' '}
          <i className='fa-solid fa-envelope-open-text sidebar-open-icon'></i> Invitations
        </SideBarItem.Link>

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

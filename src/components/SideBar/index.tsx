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
        <SideBarItem.Link to={routeLinks.yourTasks} onClick={closeSidebarWhenRedirectInMobileMode}>
          <i className='fa-solid fa-list-check'></i> Your tasks
        </SideBarItem.Link>
        <SideBarItem.Link to={'/projects'}>Project (Test)</SideBarItem.Link>
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
            style={{ fontSize: '1rem' }}
          >
            <SideBarItem style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Expander header={{ content: 'Your workspaces' }} defaultExpand>
                {workspaces.workspaceList?.map(workspace => {
                  const path = linkCreator.workspaces({
                    slug: workspace.slug,
                    workspaceId: workspace.id + '',
                    ownerShip: workspace.context
                  })
                  return (
                    <SideBarItem.Link to={path} key={workspace?.id}>
                      {workspace.name}
                    </SideBarItem.Link>
                  )
                })}
                {(!workspaces.workspaceList || workspaces.workspaceList?.length <= 0) && (
                  <>
                    <div className='note-text'>
                      <p>You currently have no workspace</p>
                      <div className='quick-input-action'>
                        <label htmlFor='quick-create-workspace-input'>
                          <i className='fa-solid fa-bolt-lightning'></i> Create your first workspace
                        </label>
                        <div className='input-button-group'>
                          <input type='text' id='quick-create-workspace-input' placeholder=' ' />
                          <button>
                            <i className='fa-solid fa-plus'></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Expander>
            </SideBarItem>
            {/* <SideBarItem style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Expander header={{ content: 'Shared projects' }} defaultExpand useArrow={false}>
                {workspaces.sharedWorkspaceList?.map(workspace => {
                  return <SideBarItem key={workspace.id}>{workspace.name}</SideBarItem>
                })}
              </Expander>
            </SideBarItem> */}
            <SharedWorkspaces />
          </Expander>
        </SideBarItem>
        <SideBarItem>
          <i className='fa-solid fa-calendar-days'></i> Schedule
        </SideBarItem>

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

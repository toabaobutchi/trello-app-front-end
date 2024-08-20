import Expander from '@comps/Expander'
import './SideBar.scss'
import './SideBar.responsive.scss'
import SideBarItem from './partials/SideBarItem'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import Button from '@comps/Button'
import routeLinks, { linkCreator } from '@routes/router'
import config from '@confs/app.config'
import SharedWorkspaces from './partials/SharedWorkspaces'
import { getSlug } from '@utils/functions'
import AddWorkspace from './partials/AddWorkspace'
import Flex from '@comps/StyledComponents'
import { useState } from 'react'
import RenderIf from '@comps/RenderIf'
import useToggle from '@hooks/useToggle'
import HideSidebarMenu from './partials/HideSidebarMenu'
import OutClickTracker from '@comps/containers/OutClickTracker'

function SideBar() {
  const workspaces = useSelector((state: RootState) => state.workspaces)
  const isMobileMode = window.innerWidth <= config.sideBar.startMobileMode.width

  const [workspaceMenuExpanded, handleToggleWorkspaceMenu, setWorkspaceMenuExpanded] = useToggle(false)

  const [sideBarExpanded, setSidebarExpanded] = useState<boolean>(
    localStorage.getItem('sidebar') === 'true' && !isMobileMode
  )
  const handleCloseWorkspaceMenu = () => setWorkspaceMenuExpanded(false)
  const toggleSidebar = () => {
    setSidebarExpanded(!sideBarExpanded)
    setWorkspaceMenuExpanded(false)
  }
  const closeSidebarWhenRedirectInMobileMode = () => {
    if (window.innerWidth <= config.sideBar.startMobileMode.width) {
      setSidebarExpanded(false)
      setWorkspaceMenuExpanded(false)
    }
  }
  return (
    <>
      <div className={`sidebar-overlay${sideBarExpanded ? ' hide' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar${sideBarExpanded ? '' : ' collapsed'}`}>
        <Flex $alignItem='center' $justifyContent='space-between' className='sidebar-header mb-1'>
          <div className='sidebar-title'>{config.appName}</div>
          <Button variant='text' theme='default' className='sidebar-toggle-btn' onClick={toggleSidebar}>
            {sideBarExpanded ? (
              <i className='fa-solid fa-arrow-left'></i>
            ) : (
              <i className='fa-solid fa-bars-staggered'></i>
            )}
          </Button>
        </Flex>
        <SideBarItem.Link to={routeLinks.home} onClick={closeSidebarWhenRedirectInMobileMode}>
          <i className='fa-solid fa-house-flag'></i> <span className='sidebar-text'>Home - Overview</span>
        </SideBarItem.Link>

        <RenderIf check={sideBarExpanded}>
          <SideBarItem style={{ paddingTop: 0, paddingBottom: 0 }}>
            <Expander
              useArrow={false}
              header={{
                content: (
                  <>
                    <i className='fa-regular fa-folder-open'></i> <span className='sidebar-text'>Workspaces</span>
                  </>
                ),
                style: { flex: 1 }
              }}
              defaultExpand
            >
              <SideBarItem className='sidebar-text' style={{ paddingBottom: 0, paddingTop: 0 }}>
                <Expander
                  useArrow={false}
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
        </RenderIf>

        <RenderIf check={!sideBarExpanded}>
          <OutClickTracker onOutClick={handleCloseWorkspaceMenu}>
            <SideBarItem className={`posr`} onClick={handleToggleWorkspaceMenu}>
              {!workspaceMenuExpanded ? (
                <i className='fa-solid fa-folder'></i>
              ) : (
                <>
                  <i className='fa-regular fa-folder-open'></i>
                  <HideSidebarMenu />
                </>
              )}
            </SideBarItem>
          </OutClickTracker>
        </RenderIf>

        <SideBarItem.Link to={routeLinks.projectInvitation}>
          <i className='fa-solid fa-envelope sidebar-close-icon'></i>{' '}
          <i className='fa-solid fa-envelope-open-text sidebar-open-icon'></i>{' '}
          <span className='sidebar-text'>Invitations</span>
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

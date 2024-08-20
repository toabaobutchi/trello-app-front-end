import Tab, { TabNav } from '@comps/Tab'
import useWorkspace from '@hooks/useWorkspace'
import { linkCreator } from '@routes/router'
import { getSlug, stopPropagation } from '@utils/functions'
import { useEffect, useRef, useState } from 'react'
import SideBarItem from '../SideBarItem'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@redux/store'
import { fetchSharedWorkspaces } from '@redux/WorkspaceSlice'
import RenderIf from '@comps/RenderIf'
import useClickTracker_v2 from '@hooks/useClickTrackerv2'
import OutClickTracker from '@comps/containers/OutClickTracker'

const tabs: TabNav[] = [
  {
    value: 'hidesidebar-own-workspace',
    display: 'Your workspaces'
  },
  {
    value: 'hidesidebar-shared-workspace',
    display: 'Shared workspaces'
  }
]
const initTab = 'hidesidebar-own-workspace'
type HideSidebarMenuProps = {
  onToggle?: () => void
}
function HideSidebarMenu({ onToggle = () => {} }: HideSidebarMenuProps) {
  const [activeTab, setActiveTab] = useState(initTab)
  const { workspaceList, sharedWorkspaceList } = useWorkspace()
  const dispatch = useDispatch<AppDispatch>()

  const handleFetchSharedWorkspaces = () => {
    dispatch(fetchSharedWorkspaces())
  }
  const handleTabClick = (value: string) => {
    setActiveTab(value)
    if (value === tabs[1].value) {
      handleFetchSharedWorkspaces()
    }
  }

  const displayWorkspace = activeTab === tabs[0].value ? workspaceList : sharedWorkspaceList

  return (
    <div onClick={stopPropagation} className='menu-content-box-shadow hide-sidebar-workspace-menu t-0 r-0 posa'>
      <Tab tabs={tabs} onTabClick={handleTabClick} activeTab={activeTab}>
        <Tab.Content show>
          {displayWorkspace?.map(workspace => {
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
          <RenderIf check={!displayWorkspace || displayWorkspace.length <= 0}>
            <p className='text-warning'>You have no workspace here!</p>
          </RenderIf>
        </Tab.Content>
      </Tab>
    </div>
  )
}

export default HideSidebarMenu

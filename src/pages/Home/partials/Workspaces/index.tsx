import Tab from '@comps/Tab'
import './Workspaces.scss'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import WorkspaceCard from '@comps/WorkspaceCard'
import Flex from '@comps/StyledComponents/Flex'
import { fetchSharedWorkspaces } from '@redux/WorkspaceSlice'

const defaultActiveTab = 'your-workspaces'

function Workspaces() {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)
  const workspaces = useSelector((state: RootState) => state.workspaces)
  const dispatch = useDispatch<AppDispatch>()
  const handleTabClick = (value: string) => {
    setActiveTab(value)
    if (value === 'shared-workspaces' && workspaces.sharedWorkspaceList.length <= 0) {
      // Fetch shared workspaces
      dispatch(fetchSharedWorkspaces())
    }
  }
  return (
    <>
      <div className='workspaces'>
        <div className='page-header mt-2'>Workspaces</div>
        <div className='workspaces-content'>
          <Tab
            tabs={[
              {
                display: (
                  <>
                    <i className='fa-solid fa-chalkboard-user'></i> Your workspaces
                  </>
                ),
                value: 'your-workspaces'
              },
              {
                display: (
                  <>
                    <i className='fa-solid fa-users-viewfinder'></i> Shared Workspaces
                  </>
                ),
                value: 'shared-workspaces'
              }
            ]}
            onTabClick={handleTabClick}
            activeTab={activeTab}
          >
            <Tab.Content show={activeTab === 'your-workspaces'}>
              <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
                {workspaces?.workspaceList?.map(workspace => {
                  return <WorkspaceCard key={workspace.id} workspace={workspace} />
                })}
              </Flex>
            </Tab.Content>
            <Tab.Content show={activeTab === 'shared-workspaces'}>
              <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
                {workspaces?.sharedWorkspaceList?.map(workspace => {
                  return <WorkspaceCard key={workspace.id} workspace={workspace} />
                })}
              </Flex>
            </Tab.Content>
          </Tab>
        </div>
      </div>
    </>
  )
}

export default Workspaces

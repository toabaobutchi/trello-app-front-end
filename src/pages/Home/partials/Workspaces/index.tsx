import Tab from '@comps/Tab'
import './Workspaces.scss'
import { useState } from 'react'

const defaultActiveTab = 'your-workspaces'

function Workspaces() {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)
  const handleTabClick = (value: string) => {
    setActiveTab(value)
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
                    <i className="fa-solid fa-chalkboard-user"></i> Your workspaces
                  </>
                ),
                value: 'your-workspaces'
              },
              {
                display: (
                  <>
                    <i className="fa-solid fa-users-viewfinder"></i> Shared Workspaces
                  </>
                ),
                value: 'shared-workspaces'
              }
            ]}
            onTabClick={handleTabClick}
            activeTab={activeTab}
          >
            <Tab.Content show={activeTab === 'your-workspaces'}>
              <div>Your workspaces</div>
            </Tab.Content>
            <Tab.Content show={activeTab === 'shared-workspaces'}>
              <div>Shared workspaces</div>
            </Tab.Content>
          </Tab>
        </div>
      </div>
    </>
  )
}

export default Workspaces

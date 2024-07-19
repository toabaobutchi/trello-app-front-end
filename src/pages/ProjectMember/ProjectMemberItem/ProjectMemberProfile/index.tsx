import Tab, { TabNav } from '@comps/Tab'
import useTab from '@hooks/useTab'
import { getDateString } from '@utils/functions'
import HttpClient from '@utils/HttpClient'
import { AssignmentProfileResponse, AssignmentResponse } from '@utils/types'
import { useEffect, useState } from 'react'
import JoinedTasksTable from './JoinedTasksTable'

const tabs: TabNav[] = [
  {
    value: 'joinedTasks',
    display: 'Join tasks'
  },
  {
    value: 'assignTasks',
    display: 'Assign new tasks'
  }
]

const initTabs = 'joinedTasks'
const http = new HttpClient()
function ProjectMemberProfile({ member }: { member?: AssignmentResponse }) {
  const { activeTab, handleTabClick } = useTab(initTabs)
  const [profile, setProfile] = useState<AssignmentProfileResponse>()
  useEffect(() => {
    http.getAuth(`/assignments/${member?.id}/profile`).then(res => {
      if (res?.status === 200) {
        setProfile(res?.data as AssignmentProfileResponse)
      }
    })
  }, [member?.id])
  useState()
  return (
    <>
      <div className='member-info-full w-full mb-1'>
        {profile && <p className='mb-1'>Join project at: {getDateString(new Date(profile.joinAt * 1000), true)}</p>}
        <Tab tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick}>
          <Tab.Content show={activeTab === tabs[0].value}>
            {profile && <JoinedTasksTable joinedTasks={profile.joinedTasks} />}
          </Tab.Content>
          <Tab.Content show={activeTab === tabs[1].value}>Assign new tasks</Tab.Content>
        </Tab>
      </div>
    </>
  )
}

export default ProjectMemberProfile

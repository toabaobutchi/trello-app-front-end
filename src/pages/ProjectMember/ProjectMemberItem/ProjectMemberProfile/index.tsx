import Tab, { TabNav } from '@comps/Tab'
import useTab from '@hooks/useTab'
import { getDateString } from '@utils/functions'
import { AssignmentProfileResponse, AssignmentResponse, ProjectMemberPageParams } from '@utils/types'
import { useEffect, useState } from 'react'
import JoinedTasksTable from './JoinedTasksTable'
import { Outlet, useParams } from 'react-router-dom'
import { useProjectSelector } from '@hooks/useProjectSelector'
import './ProjectMemberProfile.scss'
import Flex from '@comps/StyledComponents'
import { getAssignmentProfile } from '@services/assignment.services'

const tabs: TabNav[] = [
  {
    value: 'joinedTasks',
    display: 'Join tasks'
  },
  {
    value: 'activities',
    display: 'Activities'
  }
]

const initTabs = 'joinedTasks'
function ProjectMemberProfile() {
  const { activeTab, handleTabClick } = useTab(initTabs)
  const [profile, setProfile] = useState<AssignmentProfileResponse>()
  const { memberId } = useParams() as ProjectMemberPageParams
  const { members } = useProjectSelector()
  const [memberInfo, setMemberInfo] = useState<AssignmentResponse>()
  useEffect(() => {
    if (memberId) {
      getAssignmentProfile(memberId).then(res => {
        if (res?.isSuccess) {
          const data = res?.data
          setProfile(data)
          setMemberInfo(() => members.find(m => m.id === data.id))
        }
      })
    }
  }, [memberId, members])
  return (
    <>
      <div className='member-info-full w-full mb-1 flex-1 page-slide'>
        <Flex $alignItem='center' $gap='1rem' className='text-primary mb-1 py-1'>
          <img src={memberInfo?.avatar} alt='avatar' className='member-info-full-avatar' />
          <div>
            <p className='member-info-full-name'>{memberInfo?.displayName}</p>{' '}
            <p className='member-info-full-email'>{memberInfo?.email}</p>
          </div>
        </Flex>
        {profile && <p className='mb-1'>Join project at: {getDateString(new Date(profile.joinAt * 1000), true)}</p>}
        <Tab tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick}>
          <Tab.Content show={activeTab === tabs[0].value}>
            {profile && <JoinedTasksTable joinedTasks={profile.joinedTasks} />}
          </Tab.Content>
          <Tab.Content show={activeTab === tabs[1].value}>Activities</Tab.Content>
        </Tab>
      </div>
    </>
  )
}

export default ProjectMemberProfile

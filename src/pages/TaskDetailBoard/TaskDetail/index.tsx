import './TaskDetail.scss'
import Tab from '@comps/Tab'
import { memo, useState } from 'react'
import ChatBox from './ChatBox'
import TaskDetailInfo from './TaskDetailInfo'
import MemberTable from './MemberTable'
import Attachment from './Attachment'
import ReferenceTasks from './ReferenceTasks'

const tabs = [
  {
    value: 'comments',
    display: (
      <>
        <i className='fa-regular fa-comments'></i> Comments
      </>
    )
  },
  {
    value: 'members',
    display: (
      <>
        <i className='fa-solid fa-people-group'></i> Members
      </>
    )
  },
  {
    value: 'attachments',
    display: (
      <>
        <i className='fa-solid fa-paperclip'></i> Attachments
      </>
    )
  },
  {
    value: 'references',
    display: (
      <>
        <i className='fa-solid fa-link'></i> Reference to others
      </>
    )
  }
]

const initTab = 'comments'

const TaskDetail = memo(() => {
  const [activeTab, setActiveTab] = useState(initTab)
  const handleTabClick = (value: string) => {
    setActiveTab(value)
  }
  return (
    <>
      <div className='task-details'>
        <TaskDetailInfo />
        <div className='task-details-additional-info'>
          <Tab onTabClick={handleTabClick} activeTab={activeTab} tabs={tabs}>
            <Tab.Content show={activeTab === 'comments'}>
              <ChatBox />
            </Tab.Content>
            <Tab.Content show={activeTab === 'members'}>
              <MemberTable />
            </Tab.Content>
            <Tab.Content show={activeTab === 'attachments'}>
              <Attachment />
            </Tab.Content>
            <Tab.Content show={activeTab === 'references'}>
              <ReferenceTasks />
            </Tab.Content>
          </Tab>
        </div>
      </div>
    </>
  )
})

export default TaskDetail

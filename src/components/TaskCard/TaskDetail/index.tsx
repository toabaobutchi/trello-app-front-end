import './TaskDetail.scss'
import Tab from '@comps/Tab'
import { useState } from 'react'
import ChatBox from './ChatBox'
import TaskDetailInfo from './TaskDetailInfo'

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
  }
]

const initTab = 'comments'

function TaskDetail() {
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
              <div>Members</div>
            </Tab.Content>
            <Tab.Content show={activeTab === 'attachments'}>
              <div>Attachments</div>
            </Tab.Content>
          </Tab>
        </div>
      </div>
    </>
  )
}

export default TaskDetail

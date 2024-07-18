import './TaskDetail.scss'
import Tab from '@comps/Tab'
import { memo, useState } from 'react'
import ChatBox from './ChatBox'
import TaskDetailInfo from './TaskDetailInfo'
import MemberTable from './MemberTable'
import Attachment from './Attachment'

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

const TaskDetail = memo(() => {
  const [activeTab, setActiveTab] = useState(initTab)
  // const context = useContext(TaskDetailContext)
  // const [taskHub] = useState<TaskHub>(new TaskHub())
  const handleTabClick = (value: string) => {
    setActiveTab(value)
  }
  // useEffect(() => {
  //   if (!taskHub.isConnected && context?.task?.id) {
  //     const connection = taskHub.connection
  //     if (connection) {
  //       connection.then(connect => {
  //         connect?.invoke(hubs.taskDetail.send.subscribeTaskGroup, context.task?.id).catch(_ => {})
  //       })
  //     }
  //   }
  //   return () => {
  //     if (taskHub.isConnected && context?.task?.id) {
  //       taskHub.disconnect()
  //     }
  //   }
  // }, [context?.task?.id])
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
          </Tab>
        </div>
      </div>
    </>
  )
})

export default TaskDetail

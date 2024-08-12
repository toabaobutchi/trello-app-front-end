import { useEffect, useState } from 'react'
import './CalendarContent.scss'
import CalendarSelector from './CalendarSelector'
import moment from 'moment'
import Tab, { TabNav } from '@comps/Tab'
import InProgressTasks from './InProgressTasks'
import { getFlatTasks } from '@utils/functions'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { TaskResponseForBoard } from '@utils/types'

const tabs: TabNav[] = [
  {
    value: 'in-progress',
    display: 'Progressing'
  },
  {
    value: 'dueDate',
    display: 'Due in week'
  },
  {
    value: 'pending',
    display: 'Pendings'
  }
]

const initTab = 'in-progress'

function CalendarContent() {
  const [date, setDate] = useState(moment())
  const [activeTab, setActiveTab] = useState(initTab)
  const { board } = useProjectSelector()
  const [tasks, setTasks] = useState<TaskResponseForBoard[]>([])

  useEffect(() => {
    setTasks(getFlatTasks(board) ?? [])
  }, [board])

  const handleTabClick = (value: string) => {
    setActiveTab(value)
  }
  const handleChangeWeek = (addWeek: number) => {
    setDate(prev => {
      const newWeekDate = prev.clone()
      return newWeekDate.add(addWeek, 'week')
    })
  }

  return (
    <>
      <div className='calendar-container'>
        <CalendarSelector date={date} onChange={handleChangeWeek} />
        <div className='calendar-content'>
          <Tab tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick}>
            <Tab.Content show={activeTab === tabs[0].value}>
              <InProgressTasks tasks={tasks} date={date} />
            </Tab.Content>
            <Tab.Content show={activeTab === tabs[1].value}></Tab.Content>
            <Tab.Content show={activeTab === tabs[2].value}>
              <div className='pending-content'>
                <h2>Pending tasks</h2>
              </div>
            </Tab.Content>
          </Tab>
        </div>
      </div>
    </>
  )
}

export default CalendarContent

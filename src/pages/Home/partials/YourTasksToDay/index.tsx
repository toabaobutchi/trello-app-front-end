import Expander from '@comps/Expander'
import './YourTasksToDay.scss'
import TodayTask from './partials/TodayTask'

const taskList = ['Database design', 'Frontend', 'Research']

function YourTasksToDay() {
  return (
    <>
      <div className='today-tasks'>
        <Expander header='Your tasks today'>
          <div className='today-tasks-content'>
            {taskList.map((task, index) => {
              return (
                <TodayTask key={index} taskName={task} dueDate={new Date().toDateString()}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores maxime aspernatur modi aperiam
                  in possimus minima, deserunt, officiis dolor libero tempora quidem. Commodi ex impedit iure delectus.
                  Animi, expedita!
                </TodayTask>
              )
            })}
          </div>
        </Expander>
      </div>
    </>
  )
}

export default YourTasksToDay

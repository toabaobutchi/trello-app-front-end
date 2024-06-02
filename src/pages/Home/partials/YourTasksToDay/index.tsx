import './YourTasksToDay.scss'
import TodayTask from './partials/TodayTask'

// fake data
const taskList = ['Database design', 'Frontend', 'Research']

function YourTasksToDay() {
  return (
    <>
      <div className='today-tasks'>
        <div className='today-tasks-title'>Your tasks today</div>
        <div className='today-tasks-content'>
          {taskList.map((task, index) => {
            return (
              <TodayTask key={index} taskName={task} dueDate={new Date().toDateString()}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores maxime aspernatur modi aperiam in
                possimus minima, deserunt, officiis dolor libero tempora quidem. Commodi ex impedit iure delectus.
                Animi, expedita!
              </TodayTask>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default YourTasksToDay
// import YourTasksToDay from './partials/YourTasksToDay'
import Workspaces from './partials/Workspaces'
import { memo } from 'react'

const Home = memo(() => {
  return (
    <>
      {/* <YourTasksToDay /> */}
      <Workspaces />
    </>
  )
})

export default Home

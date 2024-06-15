import YourTasksToDay from './partials/YourTasksToDay'
import Workspaces from './partials/Workspaces'
import { memo } from 'react'

function Home() {
  return (
    <>
      <YourTasksToDay />
      <Workspaces />
    </>
  )
}

export default memo(Home)

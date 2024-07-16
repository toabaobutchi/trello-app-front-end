import DefaultLayout from '@layouts/DefaultLayout'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import routeLinks from '@routes/router'
import TaskDetailBoard from '@pages/TaskDetailBoard'
import HttpClient from '@utils/HttpClient'
import { WorkspacePageParams } from '@utils/types'
const Home = React.lazy(() => import('@pages/Home'))
const Error = React.lazy(() => import('@pages/Error'))
const Welcome = React.lazy(() => import('@pages/Welcome'))
const YourTasks = React.lazy(() => import('@pages/YourTasks'))
const Workspaces = React.lazy(() => import('@pages/Workspaces'))
const Project = React.lazy(() => import('@pages/Project'))
const ProjectInvitation = React.lazy(() => import('@pages/ProjectInvitation'))

const http = new HttpClient()

function App() {
  return (
    <>
      <Routes>
        <Route index path={routeLinks.welcome} element={<Welcome />} />
        <Route path={routeLinks.projectInvitation} element={<ProjectInvitation />} />
        <Route path={routeLinks.home} element={<DefaultLayout />} errorElement={<Error />}>
          <Route index element={<Home />} />
          <Route path={routeLinks.yourTasks} element={<YourTasks />} />
          <Route
            path={routeLinks.workspaces}
            element={<Workspaces />}
            loader={async ({ params }) => {
              const { ownerShip } = params as WorkspacePageParams
              const prefixPath = ownerShip === 'owner' ? 'w' : 'sw'
              const res = await http.getAuth(`/${prefixPath}/${params.workspaceId}/projects`)
              return res
            }}
          />
          <Route path={routeLinks.project} element={<Project />}>
            <Route path={routeLinks.task} element={<TaskDetailBoard />} />
          </Route>
        </Route>
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  )
}

export default App

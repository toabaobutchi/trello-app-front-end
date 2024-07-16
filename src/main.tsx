/* eslint-disable react-refresh/only-export-components */
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GlobalStyles from '@comps/GlobalStyles'
import store from './redux/store'
import config from '@confs/app.config'
import DefaultLayout from '@layouts/DefaultLayout'
import React, { Suspense } from 'react'
import routeLinks from '@routes/router'
import HttpClient from '@utils/HttpClient'
import { WorkspacePageParams } from '@utils/types'
import LoadingLayout from '@layouts/LoadingLayout'
import TaskDetailBoard from '@pages/TaskDetailBoard'
const Home = React.lazy(() => import('@pages/Home'))
const Error = React.lazy(() => import('@pages/Error'))
const Welcome = React.lazy(() => import('@pages/Welcome'))
const YourTasks = React.lazy(() => import('@pages/YourTasks'))
const Workspaces = React.lazy(() => import('@pages/Workspaces'))
const Project = React.lazy(() => import('@pages/Project'))
const ProjectInvitation = React.lazy(() => import('@pages/ProjectInvitation'))

const http = new HttpClient()

const router = createBrowserRouter([
  {
    path: routeLinks.welcome,
    element: (
      <Suspense>
        <Welcome />
      </Suspense>
    )
  },
  {
    path: routeLinks.home,
    element: <DefaultLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: routeLinks.workspaces,
        element: <Workspaces />,
        loader: async ({ params }) => {
          const { ownerShip } = params as WorkspacePageParams
          const prefixPath = ownerShip === 'owner' ? 'w' : 'sw'
          const res = await http.getAuth(`/${prefixPath}/${params.workspaceId}/projects`)
          return res
        }
      },
      {
        path: routeLinks.project,
        element: <Project />,
        children: [
          {
            path: routeLinks.task,
            element: <TaskDetailBoard />
          }
        ]
      },
      {
        path: routeLinks.yourTasks,
        element: <YourTasks />
      }
    ]
  },
  {
    path: routeLinks.projectInvitation,
    element: (
      <>
        <Suspense fallback={<LoadingLayout isLoading />}>
          <ProjectInvitation />
        </Suspense>
      </>
    ),
    loader: async ({ params }) => {
      const projectId = params.pid
      const res = await http.get(`/projects/${projectId}`)
      return res
    }
  },
  {
    path: '*',
    element: <Error />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GlobalStyles>
      <GoogleOAuthProvider clientId={config.googleClientId}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </GlobalStyles>
  </Provider>
)

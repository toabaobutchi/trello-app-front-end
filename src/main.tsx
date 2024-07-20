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
import routeLinks, { loader } from '@routes/router'
import LoadingLayout from '@layouts/LoadingLayout'
import TaskDetailBoard from '@pages/TaskDetailBoard'
import ProjectMember from '@pages/ProjectMember'
import ProjectShare from '@pages/Project/partials/ProjectHeader/ProjectShare'
const Home = React.lazy(() => import('@pages/Home'))
const Error = React.lazy(() => import('@pages/Error'))
const Welcome = React.lazy(() => import('@pages/Welcome'))
const YourTasks = React.lazy(() => import('@pages/YourTasks'))
const Workspaces = React.lazy(() => import('@pages/Workspaces'))
const Project = React.lazy(() => import('@pages/Project'))
const ProjectInvitation = React.lazy(() => import('@pages/ProjectInvitation'))

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
    path: '/',
    element: <DefaultLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        path: routeLinks.home,
        element: <Home />
      },
      {
        path: routeLinks.workspaces,
        element: <Workspaces />,
        loader: loader.workspace
      },
      {
        path: routeLinks.project,
        element: <Project />,
        children: [
          {
            path: routeLinks.task,
            element: <TaskDetailBoard />
          },
          {
            path: routeLinks.members,
            element: <ProjectMember />
          },
          {
            path: routeLinks.share,
            element: <ProjectShare />
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
    // loader: async ({ params }) => {
    //   const projectId = params.pid
    //   const res = await http.get(`/projects/${projectId}`)
    //   return res
    // }
    loader: loader.invitation
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

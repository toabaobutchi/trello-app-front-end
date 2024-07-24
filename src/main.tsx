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
import BoardContent from '@pages/Project/partials/BoardContent'
import TableContent from '@pages/Project/partials/TableContent'
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
        path: routeLinks.project.index,
        element: <Project />,
        children: [
          // view mode
          {
            path: routeLinks.project.view.index,
            children: [
              {
                path: routeLinks.project.view.overview,
                element: (
                  <>
                    <h1>Overview page - edit at main.tsx</h1>
                  </>
                )
              },
              {
                path: routeLinks.project.view.board,
                element: <BoardContent />
              },
              {
                path: routeLinks.project.view.table,
                element: <TableContent />
              }
            ]
          },
          // task details
          {
            path: routeLinks.project.task,
            element: <TaskDetailBoard />
          },
          // members
          {
            path: routeLinks.project.members.index,
            element: <ProjectMember />,
            children: [
              {
                path: routeLinks.project.members.detail,
                element: (
                  <>
                    <h1>Member detail - See <code>main.tsx</code></h1>
                  </>
                )
              }
            ]
          },
          // share
          {
            path: routeLinks.project.share,
            element: <ProjectShare />
          }
        ]
      },
      {
        path: routeLinks.yourTasks,
        element: <YourTasks />
      },
      {
        path: routeLinks.projectInvitation,
        element: (
          <>
            <ProjectInvitation />
          </>
        ),
        loader: loader.invitation
      }
    ]
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

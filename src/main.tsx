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
import TaskDetailBoard from '@pages/TaskDetailBoard'
import ProjectMember from '@pages/ProjectMember'
import ProjectShare from '@pages/ProjectShare'
import ProjectMemberProfile from '@pages/ProjectMember/ProjectMemberItem/ProjectMemberProfile'
import ToastContainer from '@comps/Toast/Container'
const Home = React.lazy(() => import('@pages/Home'))
const Error = React.lazy(() => import('@pages/Error'))
const Welcome = React.lazy(() => import('@pages/Welcome'))
const YourTasks = React.lazy(() => import('@pages/YourTasks'))
const Workspaces = React.lazy(() => import('@pages/Workspaces'))
const Project = React.lazy(() => import('@pages/Project'))
const ProjectInvitation = React.lazy(() => import('@pages/ProjectInvitation'))
const ViewContent = React.lazy(() => import('@pages/Project/partials/ViewContent'))
const RecycleBin = React.lazy(() => import('@pages/RecycleBin'))
const ChangeLog = React.lazy(() => import('@pages/ChangeLog'))

const router = createBrowserRouter([
  {
    path: routeLinks.welcome,
    element: (
      <Suspense>
        <Welcome />
      </Suspense>
    ),
    errorElement: <Error />
  },
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <Error />,
    loader: loader.layoutLoader,
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
        loader: loader.projectView,
        children: [
          // view mode
          {
            path: routeLinks.project.view,
            element: <ViewContent />,
            children: [
              // task details
              {
                path: routeLinks.project.task,
                element: <TaskDetailBoard />
              },
              {
                path: routeLinks.project.share,
                element: <ProjectShare />
              }
            ]
          },
          // task details
          {
            path: routeLinks.project.task,
            element: <TaskDetailBoard />
          },
          // change log
          {
            path: routeLinks.project.changeLog,
            element: <ChangeLog />,
            loader: loader.changeLogs,
            children: [
              {
                path: routeLinks.project.task,
                element: <TaskDetailBoard />
              }
            ]
          },
          // members
          {
            path: routeLinks.project.members.index,
            element: <ProjectMember />,
            children: [
              {
                path: routeLinks.project.members.detail,
                element: <ProjectMemberProfile />,
                children: [
                  {
                    path: routeLinks.project.task,
                    element: <TaskDetailBoard />
                  }
                ]
              },

              {
                path: routeLinks.project.share,
                element: <ProjectShare />
              }
            ]
          },
          // share
          {
            path: routeLinks.project.share,
            element: <ProjectShare />
          },
          {
            path: routeLinks.project.recycleBin,
            element: <RecycleBin />,
            loader: loader.recycleBin
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
    errorElement: <Error />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GlobalStyles>
      <GoogleOAuthProvider clientId={config.googleClientId}>
        <RouterProvider router={router} />
        <ToastContainer position='top-right' />
      </GoogleOAuthProvider>
    </GlobalStyles>
  </Provider>
)

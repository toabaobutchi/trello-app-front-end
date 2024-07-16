/* eslint-disable react-refresh/only-export-components */
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import GlobalStyles from '@comps/GlobalStyles'
import store from './redux/store'
import DefaultLayout from '@layouts/DefaultLayout'
import routeLinks from '@routes/router'
import config from '@confs/app.config'
import Error from '@pages/Error'
import HttpClient from '@utils/HttpClient'
import { ProjectPageParams, WorkspacePageParams } from '@utils/types'
import React, { Suspense } from 'react'
import LoadingLayout from '@layouts/LoadingLayout'
const Home = React.lazy(() => import('@pages/Home'))
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
    element: (
      <DefaultLayout>
        <Suspense
          fallback={
            <>
              <LoadingLayout isLoading />
            </>
          }
        >
          <Home />
        </Suspense>
      </DefaultLayout>
    ),
    errorElement: <Error />
  },
  {
    path: routeLinks.yourTasks,
    element: (
      <DefaultLayout>
        <Suspense
          fallback={
            <>
              <LoadingLayout isLoading />
            </>
          }
        >
          <YourTasks />
        </Suspense>
      </DefaultLayout>
    )
  },
  {
    path: routeLinks.workspaces,
    element: (
      <DefaultLayout>
        <Suspense
          fallback={
            <>
              <LoadingLayout isLoading />
            </>
          }
        >
          <Workspaces />
        </Suspense>
      </DefaultLayout>
    ),
    loader: async ({ params }) => {
      const { ownerShip } = params as WorkspacePageParams
      const prefixPath = ownerShip === 'owner' ? 'w' : 'sw'
      const res = await http.getAuth(`/${prefixPath}/${params.workspaceId}/projects`)
      // if (res?.status !== HttpStatusCode.Ok) {
      //   throw redirect('/')
      // }
      return res
    }
  },
  // project route
  {
    path: routeLinks.project,
    element: (
      <DefaultLayout>
        <Suspense
          fallback={
            <>
              <LoadingLayout className='row jcc w-full h-full' isLoading />
            </>
          }
        >
          <Project />
        </Suspense>
      </DefaultLayout>
    )
    // loader: async ({ params }) => {
    //   const p = params as ProjectPageParams
    //   const res = await http.getAuth(`/v2/projects/${p.projectId}/v/${p.viewMode}`)
    //   // if (res?.status !== HttpStatusCode.Ok) {
    //   //   throw redirect('/')
    //   // }
    //   return res
    // }
  },
  {
    path: routeLinks.projectInvitation,
    element: (
      <>
        <Suspense
          fallback={
            <>
              <LoadingLayout isLoading />
            </>
          }
        >
          <ProjectInvitation />
        </Suspense>
      </>
    ),
    loader: async ({ params }) => {
      const projectId = params.pid
      const res = await http.get(`/projects/${projectId}`)
      // if (res?.status !== HttpStatusCode.Ok) {
      //   throw redirect('/')
      // }
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

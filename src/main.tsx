import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import GlobalStyles from '@comps/GlobalStyles'
import store from './redux/store'
import DefaultLayout from '@layouts/DefaultLayout'
import Home from '@pages/Home'
import Welcome from '@pages/Welcome'
import routeLinks from '@routes/router'
import YourTasks from '@pages/YourTasks'
import config from '@confs/app.config'
import Error from '@pages/Error'
import Workspaces from '@pages/Workspaces'
import HttpClient from '@utils/HttpClient'
import Project from '@pages/Project'
import { ProjectPageParams } from '@utils/types'
import ProjectInvitation from '@pages/ProjectInvitation'

const http = new HttpClient()

const router = createBrowserRouter([
  {
    path: routeLinks.welcome,
    element: <Welcome />
  },
  {
    path: routeLinks.home,
    element: (
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    ),
    errorElement: <Error />
  },
  {
    path: routeLinks.yourTasks,
    element: (
      <DefaultLayout>
        <YourTasks />
      </DefaultLayout>
    )
  },
  {
    path: routeLinks.workspaces,
    element: (
      <DefaultLayout>
        <Workspaces />
      </DefaultLayout>
    ),
    loader: async ({ params }) => {
      const res = await http.getAuth(`/w/${params.workspaceId}/projects`)
      return res
    }
  },
  {
    path: routeLinks.project,
    element: (
      <DefaultLayout>
        <Project />
      </DefaultLayout>
    ),
    loader: async ({ params }) => {
      const p = params as ProjectPageParams
      const res = await http.getAuth(`/projects/${p.projectId}/v/${p.viewMode}`)
      return res
    }
  },
  {
    path: routeLinks.projectInvitation,
    element: <>
    <ProjectInvitation />
    </>,
    loader: async ({params}) => {
      const projectId = params.pid
      const res = await http.get(`/projects/${projectId}`)
      return res
    }
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

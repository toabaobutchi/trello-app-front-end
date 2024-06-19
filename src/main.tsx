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
    )
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
    loader: async ({params}) => {
      const res = await http.getAuth(`w/${params.workspaceId}/projects`, localStorage.getItem('access_token') ?? "")
      return res
    }
  },
  {
    path: routeLinks.project,
    element: (
      <DefaultLayout>
        <Project />
      </DefaultLayout>
    )
  },
  {
    path: '/*',
    errorElement: <Error />
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

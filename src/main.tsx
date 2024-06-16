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
import 'react-toastify/dist/ReactToastify.css'

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
    path: '*',
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

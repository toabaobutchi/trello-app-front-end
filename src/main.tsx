import ReactDOM from 'react-dom/client'
import GlobalStyles from '@comps/GlobalStyles'
import { Provider } from 'react-redux'
import store from './redux/store'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import DefaultLayout from '@layouts/DefaultLayout/index.tsx'
import Home from '@pages/Home/index.tsx'
import Welcome from '@pages/Welcome'
import routeLinks from '@routes/router'
import YourTasks from '@pages/YourTasks'

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
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GlobalStyles>
      <RouterProvider router={router} />
    </GlobalStyles>
  </Provider>
)

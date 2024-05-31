import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from '@comps/GlobalStyles'
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </Provider>
)

import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from '@comps/GlobalStyles'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalStyles>
    <App />
  </GlobalStyles>
)

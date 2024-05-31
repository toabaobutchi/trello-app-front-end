import config from '@confs/app.config'
import './MainMenu.scss'
import CreateBoardMenu from './partials/CreateBoardMenu'
import NavBar from './partials/NavBar'
import Button from '@comps/Button'
import { useDispatch } from 'react-redux'
import { defaultLayoutSlice } from '@layouts/DefaultLayout/DefaultLayoutSlice'

function MainMenu() {
  const dispatch = useDispatch()
  const toggleSidebar = () => {
    dispatch(defaultLayoutSlice.actions.toggleSidebar())
  }
  return (
    <>
      <div className='main-menu'>
        <div className='main-menu-header'>
          <Button variant='text' theme='default' size='large' onClick={toggleSidebar}>
            <i className='fa-solid fa-bars-staggered'></i>
          </Button>
          <h1 className='main-menu-header-text'>{config.appName}</h1>
        </div>

        <NavBar />
        <CreateBoardMenu />
      </div>
    </>
  )
}

export default MainMenu

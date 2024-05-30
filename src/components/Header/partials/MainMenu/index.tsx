import config from '@confs/app.config'
import './MainMenu.scss'
import CreateBoardMenu from './partials/CreateBoardMenu'
import NavBar from './partials/NavBar'

function MainMenu() {
  return (
    <>
      <div className='main-menu'>
        <h1 className='main-menu-header-text'>{config.appName}</h1>
        <NavBar />
        <CreateBoardMenu />
      </div>
    </>
  )
}

export default MainMenu

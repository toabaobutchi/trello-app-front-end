import Button from '@comps/Button'
import './MainMenu.scss'
import NavBar from './partials/NavBar'

function MainMenu() {
  return (
    <>
      <div className='main-menu'>
        <h1 className='main-menu-header-text'>Trello</h1>
        <NavBar />
        <Button className='main-menu-create-button' variant='filled' style={{ padding: '0.6rem 0.7rem' }}>
          <span className='main-menu-create-button-desktop'>Create</span>
          <span className='main-menu-create-button-mobile'>
            <i className='fa-solid fa-plus'></i>
          </span>
        </Button>
      </div>
    </>
  )
}

export default MainMenu

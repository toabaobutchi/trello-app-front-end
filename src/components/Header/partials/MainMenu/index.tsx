import Button from '@comps/Button'
import './MainMenu.scss'
import NavBar from './partials/NavBar'

function MainMenu() {
  
  return (
    <>
      <div className='main-menu'>
        <h1 className='main-menu-header-text'>Trello</h1>
        <NavBar />
        <Button variant='filled' style={{ padding: '0.6rem 0.7rem' }}>
          Create
        </Button>
      </div>
    </>
  )
}

export default MainMenu

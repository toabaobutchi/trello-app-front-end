import './Header.scss'
import MainMenu from './partials/MainMenu'
import UtilitiesMenu from './partials/UtilitiesMenu'

function Header() {
  return (
    <>
      <header className='header'>
        <MainMenu />
        <UtilitiesMenu />
      </header>
    </>
  )
}

export default Header

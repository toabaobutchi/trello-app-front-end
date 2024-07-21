import Flex from '@comps/StyledComponents'
import SwitchButton from '@comps/SwitchButton'
import { useState } from 'react'

function InformationMenu() {
  const [theme, setTheme] = useState(() => {
    const currentTheme = localStorage.getItem('theme') || 'light'
    return currentTheme === 'light'
  })
  const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked)
    if (e.target.checked) {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    } else {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    }
  }
  return (
    <>
      <Flex $alignItem='center' $gap='0.25rem'>
        <SwitchButton
          size='medium'
          onChange={handleChangeTheme}
          inputAttributes={{ type: 'checkbox', id: 'theme-toggle-button', checked: theme }}
          icon={{
            checked: <i className='fa-solid fa-sun'></i>,
            unchecked: <i className='fa-solid fa-moon text-warning'></i>
          }}
        />
        {/* <label htmlFor='theme-toggle-button'>
          {theme ? (
            <>
              <i className='fa-solid fa-sun'></i>
            </>
          ) : (
            <>
              <span className='text-warning'>
                <i className='fa-solid fa-moon'></i>
              </span>
            </>
          )}
        </label> */}
      </Flex>
    </>
  )
}

export default InformationMenu

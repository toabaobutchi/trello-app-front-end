import Button from '@comps/Button'
// import Menu from '@comps/Menu'
import Flex from '@comps/StyledComponents/Flex'
// import useMenu from '@hooks/useMenu'
import './ProjectChangeLog.scss'
import FixedMenu from '@comps/FixedMenu'

function ProjectChangeLog() {
  // const menu = useMenu<HTMLButtonElement>()
  return (
    <>
      <FixedMenu
        side='right'
        height='half'
        style={{ top: '5px' }}
        layout={{
          header: {
            content: (
              <>
                <Flex $alignItem='center' $justifyContent='space-between' className='change-log-header'>
                  <p className='change-log-header-text text-primary bolder'>Project Change Log</p>
                  <Button variant='text' theme='default'>
                    <i className='fa-solid fa-times'></i>
                  </Button>
                </Flex>
              </>
            )
          }
        }}
        title={{
          content: (
            <Button>
              <i className='fa-solid fa-timeline fa-fw'></i>
            </Button>
          )
        }}
      >
        <div className='change-log-container'>
          <div className='change-log-item'>
            <p className='change-log-item-time text-secondary'>Added at 19/07/2024</p>
            <p className='change-log-item-description'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel ipsum in ipsum dignissim gravida.
            </p>
          </div>
        </div>
      </FixedMenu>

      {/* <Menu
        style={{ width: '400px' }}
        header={
          <>
            <Flex $alignItem='center' $justifyContent='space-between' className='change-log-header'>
              <p className='change-log-header-text text-primary bolder'>Project Change Log</p>
              <Button onClick={menu.closeMenu} variant='text' theme='default'>
                <i className='fa-solid fa-times'></i>
              </Button>
            </Flex>
          </>
        }
        open={menu.open}
        anchorElement={menu.anchorRef.current}
        onClose={menu.closeMenu}
      >
        <div className='change-log-container'>
          <div className='change-log-item'>
            <p className='change-log-item-time text-secondary'>Added at 19/07/2024</p>
            <p className='change-log-item-description'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel ipsum in ipsum dignissim gravida.
            </p>
          </div>
        </div>
      </Menu> */}
    </>
  )
}

export default ProjectChangeLog

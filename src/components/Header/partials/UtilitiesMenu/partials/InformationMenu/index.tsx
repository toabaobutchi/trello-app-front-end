import FixedMenu from '@comps/FixedMenu'
import ImageBox from '@comps/ImageBox'
import MenuFooter from '@comps/MenuFooter'

function InformationMenu() {
  return (
    <>
      <FixedMenu
        title={{
          content: <i className='fa-regular fa-circle-question'></i>,
          classes: 'utils-menu__hover utils-menu-help tooltip',
          customHtmlAttributes: { 'tooltip-content': 'Information' }
        }}
        style={{ top: '3.43rem', right: '0.5%' }}
        width='350px'
        side='right'
        layout={{
          footer: {
            content: (
              <MenuFooter
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  width: '100%',
                  gap: '1rem'
                }}
              >
                <p>Item 1</p>
                <p>Item 2</p>
                <p>Item 3</p>
                <p>Item 4</p>
                <p>Item 5</p>
                <p>Item 6</p>
              </MenuFooter>
            )
          }
        }}
      >
        <ImageBox
          src='https://trello.com/assets/77d4b431a528da2dd7c6.png'
          caption={{
            content: (
              <>
                <p>New to Trello? Check out the guide</p>
                <div style={{ textAlign: 'center' }}>
                  <a href='#'>Get new tip...</a>
                </div>
              </>
            ),
            style: { fontSize: '1rem' }
          }}
        />
      </FixedMenu>
    </>
  )
}

export default InformationMenu

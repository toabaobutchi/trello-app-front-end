import FixedMenu from '@comps/FixedMenu'
import MenuGroup from '@comps/MenuGroup'
import MenuItem from '@comps/MenuItem'

function AccountMenu() {
  return (
    <>
      <FixedMenu
        side='right'
        title={{
          content: 'AH',
          classes: 'utils-menu-user tooltip',
          customHtmlAttributes: { 'tooltip-content': 'Account' }
        }}
        style={{ top: '3.43rem', right: '0.3%' }}
        width='330px'
      >
        <MenuGroup title={{ content: 'Account', style: { textTransform: 'capitalize' } }} divisor expandGroup={null}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuGroup>
        <MenuGroup title={{ content: 'Trello', style: { textTransform: 'uppercase' } }} divisor expandGroup={null}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuGroup>
        <MenuGroup divisor expandGroup={null}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
        </MenuGroup>
        <MenuGroup expandGroup={null}>
          <MenuItem>Item 1</MenuItem>
        </MenuGroup>
      </FixedMenu>
    </>
  )
}

export default AccountMenu

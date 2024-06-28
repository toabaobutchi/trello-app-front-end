import useMenu from '@hooks/useMenu'
import './PriorityTag.scss'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import config from '@confs/app.config'
function PriorityTag({ priority }: { priority?: string | null }) {
  const menu = useMenu<HTMLSpanElement>()
  return (
    <>
      <span ref={menu.anchorRef} onClick={menu.toggleMenu} className={`priority-tag priority-tag__${priority ? priority?.toLowerCase() : 'default'}`}>
        {priority ? priority + ' Priority' : 'Priority not set'}
      </span>
      <Menu open={menu.open} anchorElement={menu.anchorRef.current} onClose={menu.closeMenu}>
        {config.priorities.map(item => {
          return <MenuItem size='small' key={item} className={`priority-tag__${item.toLowerCase()}`}>{item}</MenuItem>
        })}
        <MenuItem className='priority-tag__default'><i className="fa-solid fa-xmark"></i> Unset priority</MenuItem>
      </Menu>
    </>
  )
}

export default PriorityTag

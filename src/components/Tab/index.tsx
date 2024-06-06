import './Tab.scss'

interface TabNav {
  value: string
  display?: React.ReactNode
  toggleId?: string
}

interface TabProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  tabs?: TabNav[]
  activeTab?: string
  onTabClick?: (value: string) => void
}

function Tab({ children = '', activeTab = '', onTabClick = () => {}, tabs }: TabProps) {
  const handleClickTab = (value: string) => {
    onTabClick(value)
  }
  return (
    <>
      <div className='tab'>
        <div className='tab-list'>
          {tabs?.map(tab => {
            return (
              <div
                key={tab.value}
                toggle-id={tab.toggleId ?? tab.value}
                className={`tab-list-item${activeTab === tab.value ? ' active' : ''}`}
                onClick={() => handleClickTab(tab.value)}
              >
                {tab.display ?? tab.value}
              </div>
            )
          })}
        </div>
        <div className='tab-contents'>{children}</div>
      </div>
    </>
  )
}

const Content = function ({ children = '', show = false, ...props }: React.ComponentProps<'div'> & { show?: boolean }) {
  return (
    <>
      {show && (
        <div className={`tab-content ${props?.className ?? ''}`.trimEnd()} style={props?.style}>
          {children}
        </div>
      )}
    </>
  )
}

Tab.Content = Content

export default Tab

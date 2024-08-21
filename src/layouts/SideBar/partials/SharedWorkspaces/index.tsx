import Expander from '@comps/Expander'
import SideBarItem from '../SideBarItem'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@redux/store'
import { fetchSharedWorkspaces } from '@redux/WorkspaceSlice'
import { linkCreator } from '@routes/router'
import { getSlug } from '@utils/functions'
import useWorkspace from '@hooks/useWorkspace'

function SharedWorkspaces() {
  const { sharedWorkspaceList } = useWorkspace()
  const dispatch = useDispatch<AppDispatch>()
  const handleFetchSharedWorkspaces = (expand: boolean) => {
    if (expand) dispatch(fetchSharedWorkspaces())
  }
  return (
    <>
      <SideBarItem className='sidebar-text' style={{ paddingBottom: 0, paddingTop: 0 }}>
        <Expander
          onExpand={handleFetchSharedWorkspaces}
          header={{
            content: (
              <p>
                <i className='fa-solid fa-share-nodes'></i> Shared workspaces
              </p>
            )
          }}
          useArrow={false}
        >
          {sharedWorkspaceList?.map(workspace => {
            return (
              <SideBarItem.Link
                to={linkCreator.workspaces({
                  ownerShip: workspace.context,
                  slug: getSlug(workspace.slug),
                  workspaceId: workspace.id + ''
                })}
                key={workspace.id}
              >
                {workspace.name}
              </SideBarItem.Link>
            )
          })}
        </Expander>
      </SideBarItem>
    </>
  )
}

export default SharedWorkspaces

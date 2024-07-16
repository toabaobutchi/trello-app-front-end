import Expander from '@comps/Expander'
import SideBarItem from '../SideBarItem'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { fetchSharedWorkspaces } from '@redux/WorkspaceSlice'
import { linkCreator } from '@routes/router'
import { getSlug } from '@utils/functions'

function SharedWorkspaces() {
  const sharedWorkspaces = useSelector((state: RootState) => state.workspaces.sharedWorkspaceList)
  const dispatch = useDispatch<AppDispatch>()
  const handleFetchSharedWorkspaces = (expand: boolean) => {
    if (expand) dispatch(fetchSharedWorkspaces())
  }
  return (
    <>
      <SideBarItem style={{ paddingBottom: 0, paddingTop: 0 }}>
        <Expander
          onExpand={handleFetchSharedWorkspaces}
          header={{
            content: (
              <p>
                <i className='fa-solid fa-share-nodes'></i> Shared workspaces
              </p>
            )
          }}
          useArrow={true}
        >
          {sharedWorkspaces?.map(workspace => {
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

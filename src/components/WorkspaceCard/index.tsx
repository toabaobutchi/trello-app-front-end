import { WorkspaceResponse } from '@utils/types/workspace.type'
import './WorkspaceCard.scss'
import { useNavigate } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import Button from '@comps/Button'
import { getDateString } from '@utils/functions'
import Flex from '@comps/StyledComponents/Flex'

function WorkspaceCard({ workspace }: { workspace: WorkspaceResponse }) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(
      linkCreator.workspaces({
        workspaceId: workspace.id + '',
        slug: workspace.slug,
        ownerShip: workspace.context
      })
    )
  }
  return (
    <>
      <div className='workspace-card'>
        <div className='workspace-card__header'>
          <h2>{workspace.name}</h2>
        </div>
        <div className='workspace-card__content'>
          <p className='workspace-card__content__description'>{workspace.description}</p>
          <p className='workspace-card__content__creation-time'>
            <b>Created at:</b> {getDateString(new Date(workspace.createdAt), true)}
          </p>
        </div>
        <div className='workspace-card__footer'>
          <Flex $alignItem='center' $justifyContent='end'>
            <Button variant='filled' onClick={handleClick}>
              Take a look
            </Button>
          </Flex>
        </div>
      </div>
    </>
  )
}

export default WorkspaceCard

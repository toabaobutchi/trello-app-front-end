import Flex from '@comps/StyledComponents/Flex'
import './WorkspaceHeader.scss'
import WorkspaceNameEditor from '../WorkspaceNameEditor'
import { WorkspaceResponseWithRelatedProjects } from '@utils/types/workspace.type'
import { useState } from 'react'
import useAccount from '@hooks/useAccount'

function WorkspaceHeader({ workspace }: { workspace: WorkspaceResponseWithRelatedProjects }) {
  const account = useAccount()
  const [creator] = useState(() => {
    if (workspace?.context?.toLowerCase() === 'owner' && !workspace?.owner) {
      return account
    } else return workspace?.owner
  })
  return (
    <>
      <Flex $alignItem='center' $gap='1rem' className='page-header workspace-header'>
        <WorkspaceNameEditor workspace={workspace} />
        <Flex $alignItem='center' $gap='0.5rem' className='workspace-header-creator'>
          <img src={creator?.avatar} alt='creator avatar' />
          <p>
            {creator?.email} ({creator?.displayName})
          </p>
        </Flex>
      </Flex>
    </>
  )
}

export default WorkspaceHeader

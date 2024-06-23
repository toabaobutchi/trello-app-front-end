import Flex from '@comps/StyledComponents/Flex'
import './WorkspaceHeader.scss'
import WorkspaceNameEditor from '../WorkspaceNameEditor'
import { WorkspaceResponseWithRelatedProjects } from '@utils/types'

function WorkspaceHeader({workspace}: {workspace: WorkspaceResponseWithRelatedProjects}) {
  return (
    <>
      <Flex $alignItem='center' $gap='1rem' className='page-header workspace-header'>
        <WorkspaceNameEditor workspace={workspace} />
      </Flex>
    </>
  )
}

export default WorkspaceHeader

import { ProjectCardType } from '@utils/types/project.type'
import './ProjectCard.scss'
import Flex from '@comps/StyledComponents/Flex'
import Button from '@comps/Button'
import Tooltip from '@comps/Tooltip'
import { useNavigate } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import Modal from '@comps/Modal'
import UpdateProjectEditor from './UpdateProjectEditor'
import { useModal } from '@hooks/useModal'

function ProjectCard({ project }: { project: ProjectCardType }) {
  const [updateModal, handleToggleUpdateModal] = useModal()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const navigateToProjectDetail = () => {
    navigate(
      linkCreator.project({
        ownerShip: project.context ?? '',
        projectId: project.id ?? '',
        slug: project.slug as string,
        viewMode: 'board'
      })
    )
  }
  const handleTogglePinProject = () => {
    //TODO call api
    dispatch(
      workspaceSlice.actions.togglePinProject({
        projectId: project.id,
        isPinned: Boolean(project.assignmentConfig?.isPinned)
      })
    )
  }
  const isOwner = project?.context?.toLowerCase() === 'owner'
  return (
    <>
      <div
        className='project-card'
        style={
          {
            ['--clr']: project.color || 'transparent',
            ['--text-clr']: project.color || 'inherit'
          } as React.CSSProperties
        }
      >
        <Flex className='my-1' $alignItem='center' $justifyContent='space-between'>
          <p className='project-card-name'>{project.name}</p>
          <div className='pinned-project-button' onClick={handleTogglePinProject}>
            {project.assignmentConfig?.isPinned ? (
              <i className='fa-solid fa-star pinned-icon'></i>
            ) : (
              <i className='fa-regular fa-star no-pinned-icon'></i>
            )}
          </div>
        </Flex>
        <p className='project-card-sub-text'>
          <b className='text-primary'>Create:</b>{' '}
          {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '[ Not set ]'}
        </p>
        <div className='project-card-sub-text row gap-1'>
          <b className='text-primary'>Due date:</b>
          {project.dueDate ? (
            new Date(project.dueDate).toLocaleDateString()
          ) : (
            <Tooltip content='No specified due date. Update at <code>More > Update</code>' position='right' arrow>
              <Tooltip.Text>[No data]</Tooltip.Text>
            </Tooltip>
          )}
        </div>
        <p className='project-card-sub-text'>
          <b className='text-primary'>Member:</b> {project.memberCount}
        </p>
        <p className='project-card-sub-text'>
          <b className='text-primary'>Your permission:</b> {project.assignmentConfig.permission}
        </p>
        <p className='project-card-sub-text'>
          <b className='text-primary'>Last view:</b>{' '}
          {project.assignmentConfig?.lastViewAt && new Date(project.assignmentConfig.lastViewAt).toLocaleDateString()}
        </p>
        <p className='project-card-description'>{project.description}</p>
        <Flex $alignItem='center' $justifyContent='end' $gap='0.5rem' style={{ marginTop: '0.5rem' }}>
          <Button onClick={navigateToProjectDetail} variant='filled'>
            Take a look
          </Button>
          {isOwner && (
            <Button onClick={handleToggleUpdateModal} variant='text' theme='secondary' className='row'>
              Update&nbsp;<i className='fa-solid fa-pen-nib'></i>
            </Button>
          )}
        </Flex>
      </div>
      <Modal
        open={updateModal}
        onClose={handleToggleUpdateModal}
        layout={{
          header: {
            title: 'Update project',
            closeIcon: true
          }
        }}
      >
        <UpdateProjectEditor projectId={project?.id} onClose={handleToggleUpdateModal} />
      </Modal>
    </>
  )
}

export default ProjectCard

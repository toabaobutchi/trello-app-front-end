import { ProjectCardType } from '@utils/types'
import './ProjectCard.scss'
import Flex from '@comps/StyledComponents/Flex'
import Button from '@comps/Button'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import Tooltip from '@comps/Tooltip'
import useMenu from '@hooks/useMenu'
import { useNavigate } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import Modal from '@comps/Modal'
import UpdateProjectEditor from './UpdateProjectEditor'

function ProjectCard({ project }: { project: ProjectCardType }) {
  const { open, anchorRef, toggleMenu, closeMenu } = useMenu<HTMLButtonElement>()
  const [updateModal, setUpdateModal] = useState(false)
  const dispatch = useDispatch()
  const [projectState, setProjectState] = useState<ProjectCardType>()
  useEffect(() => {
    setProjectState(project)
  }, [project])
  const navigate = useNavigate()
  const navigateToProjectDetail = () => {
    navigate(
      linkCreator.project({
        ownerShip: projectState?.context ?? '',
        projectId: projectState?.id ?? '',
        slug: projectState?.slug as string,
        viewMode: 'board'
      })
    )
  }
  const handleTogglePinProject = () => {
    setProjectState(
      prev =>
        ({
          ...prev,
          assignmentConfig: {
            ...prev?.assignmentConfig,
            isPinned: !prev?.assignmentConfig?.isPinned
          }
        } as ProjectCardType)
    )
    //TODO call api
    dispatch(
      workspaceSlice.actions.togglePinProject({
        projectId: projectState?.id,
        isPinned: Boolean(projectState?.assignmentConfig?.isPinned)
      })
    )
  }
  const handleToggleUpdateModal = () => {
    setUpdateModal(!updateModal)
    closeMenu()
  }
  return (
    <>
      <div
        className='project-card'
        style={
          {
            ['--clr']: projectState?.color || 'transparent',
            ['--text-clr']: projectState?.color || 'inherit'
          } as React.CSSProperties
        }
      >
        <Flex className='my-1' $alignItem='center' $justifyContent='space-between'>
          <p className='project-card-name'>{projectState?.name}</p>
          <div className='pinned-project-button' onClick={handleTogglePinProject}>
            {projectState?.assignmentConfig?.isPinned ? (
              <i className='fa-solid fa-star pinned-icon'></i>
            ) : (
              <i className='fa-regular fa-star no-pinned-icon'></i>
            )}
          </div>
        </Flex>
        <p className='project-card-sub-text'>
          <b className='text-primary'>Create:</b>{' '}
          {projectState?.createdAt ? new Date(projectState?.createdAt * 1000).toLocaleDateString() : '[ Not set ]'}
        </p>
        <div className='project-card-sub-text row gap-1'>
          <b className='text-primary'>Due date:</b>
          {projectState?.dueDate ? (
            new Date(projectState?.dueDate * 1000).toLocaleDateString()
          ) : (
            <Tooltip content='No specified due date. Update at <code>More > Update</code>' position='right' arrow>
              <Tooltip.Text>[No data]</Tooltip.Text>
            </Tooltip>
          )}
        </div>
        <p className='project-card-sub-text'>
          <b className='text-primary'>Member:</b> {projectState?.memberCount}
        </p>
        <p className='project-card-sub-text'>
          <b className='text-primary'>Your permission:</b> {projectState?.assignmentConfig.permission}
        </p>
        <p className='project-card-description'>{projectState?.description}</p>
        <Flex $alignItem='center' $justifyContent='end' $gap='0.5rem' style={{ marginTop: '0.5rem' }}>
          <Button onClick={navigateToProjectDetail} variant='filled'>
            Take a look
          </Button>
          <Button ref={anchorRef} variant='text' theme='secondary' className='row' onClick={toggleMenu}>
            More&nbsp;<i className='fa-solid fa-caret-down'></i>
          </Button>
        </Flex>
        <Menu open={open} anchorElement={anchorRef?.current} onClose={closeMenu}>
          <MenuItem onClick={handleToggleUpdateModal} className='project-update-btn'>
            <i className='fa-regular fa-pen-to-square'></i> Update
          </MenuItem>
          <MenuItem className='project-delete-btn'>
            <i className='fa-regular fa-trash-can'></i> Delete
          </MenuItem>
        </Menu>
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

import { AssignmentResponse, ProjectResponse, SelectListItem } from '@utils/types'
import './ProjectOptions.scss'
import Flex from '@comps/StyledComponents/Flex'
import { useState } from 'react'
import SelectList from '@comps/SelectList'
import { getAssignmentsFromAnotherProject } from '@services/assignment.services'

type ProjectOptionsProps = {
  project: ProjectResponse
  onChange?: (projectId: string, options: ProjectSelectOptions) => void
}
type SelectBoxState = {
  isOpen: boolean
  assignments?: AssignmentResponse[]
}

type SelectAssignmentType = {
  id: string
  permission: string
}

export type ProjectSelectOptions = {
  isAll: boolean
  selectedAssignments: SelectAssignmentType[]
}

const initSelectOptionsState: ProjectSelectOptions = {
  isAll: false,
  selectedAssignments: []
}

const getRoles = (assignmentId: string) => {
  return [
    {
      value: assignmentId + '-admin',
      display: 'Admin'
    },
    {
      value: assignmentId + '-member',
      display: 'Member'
    },
    {
      value: assignmentId + '-observer',
      display: 'Observer'
    }
  ] as SelectListItem[]
}

const getRole = (assignment: AssignmentResponse) => {
  const permission = assignment.permission?.toLowerCase() !== 'owner' ? assignment.permission?.toLowerCase() : 'admin'
  return `${assignment.id}-${permission}`
}

const ProjectOptions = ({ project, onChange = () => {} }: ProjectOptionsProps) => {
  const [selectBox, setSelectBox] = useState<SelectBoxState>({ isOpen: false })
  const [projectSelects, setProjectSelects] = useState<ProjectSelectOptions>(initSelectOptionsState)

  const handleToggleAssignmentsBox = async () => {
    setSelectBox(prevState => ({ ...prevState, isOpen: !prevState.isOpen }))
    const res = await getAssignmentsFromAnotherProject(project.id)
    if (res?.isSuccess) {
      setSelectBox(prevState => ({ ...prevState, assignments: res.data }))
    }
  }

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectSelects(prev => ({ ...prev, isAll: e.target.checked }))
    onChange(project.id, { ...projectSelects, isAll: e.target.checked })
  }

  const handleSelectAssignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedAssignmentId = e.target.value
    // trường hợp thêm vào - checked
    if (e.target.checked) {
      const assignment = selectBox?.assignments?.find(a => a.id === selectedAssignmentId)
      // thêm vào
      setProjectSelects(prev => {
        const newProjectSelects = { ...prev }
        newProjectSelects.selectedAssignments = [
          ...newProjectSelects.selectedAssignments,
          { id: selectedAssignmentId, permission: getRole(assignment as AssignmentResponse) ?? 'observer' }
        ]
        newProjectSelects.isAll = newProjectSelects.selectedAssignments.length === selectBox.assignments?.length
        onChange(project.id, newProjectSelects)
        return newProjectSelects
      })
    }
    // trường hợp xoá - unchecked
    else {
      setProjectSelects(prev => {
        const newProjectSelects = { ...prev }
        newProjectSelects.selectedAssignments = newProjectSelects.selectedAssignments.filter(
          a => a.id !== selectedAssignmentId
        )
        newProjectSelects.isAll = false // không còn chọn tất cả
        onChange(project.id, newProjectSelects)
        return newProjectSelects
      })
    }
  }

  const handleChoosePermission = ({ value }: { value: string }) => {
    const assignmentId = value.split('-')[0]
    setProjectSelects(prev => {
      const newProjectSelects = { ...prev }
      const assignment = newProjectSelects.selectedAssignments?.find(a => a.id === assignmentId)
      if (assignment) {
        assignment.permission = value
      }
      onChange(project.id, newProjectSelects)
      return newProjectSelects
    })
  }

  return (
    <>
      <div className='project-options-container'>
        <Flex $alignItem='center' $gap='0.5rem'>
          <div className='project-options-select-all row gap-1'>
            <input
              type='checkbox'
              id={`project-select-all-${project.id}`}
              checked={projectSelects.isAll}
              onChange={handleToggleSelectAll}
            />
            <label htmlFor={`project-select-all-${project.id}`}>{project.name}</label>
          </div>
          <div
            onClick={handleToggleAssignmentsBox}
            className='project-options-select-more-button text-secondary cpointer'
          >
            {selectBox.isOpen ? (
              <span>
                Hide <i className='fa-solid fa-caret-up'></i>
              </span>
            ) : (
              <span>
                More <i className='fa-solid fa-caret-down'></i>
              </span>
            )}
          </div>
        </Flex>
        {selectBox.isOpen && (
          <>
            {selectBox.assignments?.map(assignment => {
              let checked = projectSelects.isAll
              const selectedAssignment = projectSelects.selectedAssignments?.find(a => a.id === assignment.id)
              if (!checked) {
                checked = Boolean(selectedAssignment)
              }
              return (
                <Flex
                  key={assignment.id}
                  $alignItem='center'
                  $justifyContent='space-between'
                  className='project-options-select-item'
                >
                  <Flex $alignItem='center' $gap='0.5rem'>
                    <input
                      type='checkbox'
                      id={`assignment-select-${assignment?.id}`}
                      value={assignment?.id}
                      checked={checked}
                      onChange={handleSelectAssignment}
                    />
                    <label htmlFor={`assignment-select-${assignment?.id}`}>
                      {assignment?.email} - {assignment.displayName}
                    </label>
                  </Flex>
                  {checked && (
                    <SelectList
                      size='small'
                      items={getRoles(assignment.id)}
                      selectedValue={selectedAssignment?.permission}
                      onChoose={handleChoosePermission}
                    />
                  )}
                </Flex>
              )
            })}
            {selectBox.assignments && selectBox.assignments.length <= 0 && (
              <>
                <span className='text-danger'>No assignees found</span>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ProjectOptions

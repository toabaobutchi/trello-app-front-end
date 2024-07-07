import { useEffect, useState } from 'react'
import './UpdateProjectEditor.scss'
import {
  ProjectDataInput,
  ProjectResponseForUpdating,
  UpdateProjectModel,
  UpdateProjectResponse
} from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import LoadingLayout from '@layouts/LoadingLayout'
import FloatLabelInput from '@comps/FloatLabelInput'
import TextArea from '@comps/TextArea'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import ColorPicker from '@comps/ColorPicker'
import Button from '@comps/Button'
import { getDateTimeString, getDisplayDateString } from '@utils/functions'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'

const http = new HttpClient()

function UpdateProjectEditor({ projectId, onClose = () => {} }: { projectId?: string; onClose?: () => void }) {
  const dispatch = useDispatch()
  const [project, setProject] = useState<ProjectDataInput>()
  const [originalData, setOriginalData] = useState<ProjectResponseForUpdating>()
  useEffect(() => {
    http.getAuth(`/projects/${projectId}/updating`).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        const data = res?.data as ProjectResponseForUpdating
        setOriginalData(data)
        const inputData: ProjectDataInput = {
          ...data,
          useColor: Boolean(data?.color)
        }
        setProject(inputData)
      }
    })
  }, [projectId])
  const handleChangeBoard = {
    toggleSetDueDate(e: React.ChangeEvent<HTMLInputElement>) {
      setProject({ ...project, dueDate: e.currentTarget.checked ? undefined : Date.now() } as ProjectDataInput)
    },
    inputs(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setProject({ ...project, [e.currentTarget.name]: e.target.value } as ProjectDataInput)
    },
    toggleUseColor(e: React.ChangeEvent<HTMLInputElement>) {
      setProject({ ...project, useColor: e.currentTarget.checked } as ProjectDataInput)
    },
    setDueDate(e: React.ChangeEvent<HTMLInputElement>) {
      setProject({ ...project, dueDate: new Date(e.target.value).getTime() } as ProjectDataInput)
    }
  }
  const handleReset = () => {
    setProject({ ...originalData, useColor: Boolean(originalData?.color) } as ProjectDataInput)
  }
  const handleSubmit = async () => {
    const data: UpdateProjectModel = {
      name: project?.name ?? '',
      color: project?.useColor ? project?.color : undefined,
      description: project?.description,
      dueDate: project?.dueDate ? project?.dueDate : undefined
    }
    const res = await http.putAuth(`projects/${projectId}`, data)
    if (res?.status === HttpStatusCode.Ok) {
      // dispatch to change UI
      const data = res?.status as UpdateProjectResponse
      dispatch(workspaceSlice.actions.updateProject(data))
      onClose()
    } else {
      handleReset()
    }
  }
  return (
    <>
      <LoadingLayout className='row jcc' style={{ minHeight: '300px' }} isLoading={!project}>
        <FloatLabelInput
          label='Board title'
          input={{ id: 'create-board', name: 'name', autoFocus: true, value: project?.name }}
          onChange={handleChangeBoard.inputs}
        />

        <Flex className='mt-1' $alignItem='center' $gap='1rem'>
          <Flex $gap='0.5rem' $alignItem='center'>
            <SwitchButton
              inputAttributes={{ type: 'checkbox', id: 'use-color', checked: project?.useColor }}
              size='small'
              onChange={handleChangeBoard.toggleUseColor}
            />
            <label style={{ cursor: 'pointer' }} htmlFor='use-color'>
              Use background color
            </label>
          </Flex>
          {project?.useColor && (
            <ColorPicker
              label={{
                content: (
                  <p>
                    <i className='fa-solid fa-caret-right'></i>&nbsp; Select project color:
                  </p>
                )
              }}
              input={{ id: 'project-color', value: project?.color, name: 'color' }}
              onChange={handleChangeBoard.inputs}
            />
          )}
        </Flex>

        <Flex className='mt-1' $gap='0.5rem' $alignItem='center'>
          <SwitchButton
            inputAttributes={{ type: 'checkbox', id: 'set-dute-date', checked: !project?.dueDate }}
            size='small'
            onChange={handleChangeBoard.toggleSetDueDate}
          />
          <label style={{ cursor: 'pointer' }} htmlFor='set-dute-date'>
            I do not want to set due date
          </label>
          {project?.dueDate && (
            <input
              type='datetime-local'
              value={getDateTimeString(new Date(project?.dueDate))}
              name='dueDate'
              id='due-date-selector'
              onChange={handleChangeBoard.setDueDate}
              min={
                project?.dueDate
                  ? getDateTimeString(new Date(project.dueDate))
                  : project?.minimunAllowedDueDate
                  ? getDateTimeString(new Date(project.minimunAllowedDueDate))
                  : ''
              }
            />
          )}
        </Flex>
        {project?.minimunAllowedDueDate && (
          <p className='text-warning'>
            The minimum due date you can set is: {getDisplayDateString(new Date(project.minimunAllowedDueDate))}
          </p>
        )}
        <TextArea
          label='Description (optional)'
          name='description'
          value={project?.description}
          onChange={handleChangeBoard.inputs}
          rows={5}
        />

        <Flex $alignItem='center' $justifyContent='end' className='mt-1' $gap='1rem'>
          <Button size='medium' theme='success' onClick={handleReset}>
            <i className='fa-solid fa-rotate-left'></i> Reset
          </Button>
          <Button size='medium' onClick={handleSubmit} disabled={!project?.name.trim()}>
            <i className='fa-regular fa-floppy-disk'></i> Save changes
          </Button>
        </Flex>
      </LoadingLayout>
    </>
  )
}

export default UpdateProjectEditor

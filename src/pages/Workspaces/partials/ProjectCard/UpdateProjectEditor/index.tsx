import { useEffect, useState } from 'react'
import './UpdateProjectEditor.scss'
import { ProjectDataInput, ProjectResponseForUpdating } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import LoadingLayout from '@layouts/LoadingLayout'
import FloatLabelInput from '@comps/FloatLabelInput'
import TextArea from '@comps/TextArea'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import ColorPicker from '@comps/ColorPicker'
import Button from '@comps/Button'
import { getDateTimeString } from '@utils/functions'

const http = new HttpClient()

function UpdateProjectEditor({ projectId, onClose = () => {} }: { projectId?: string; onClose?: () => void }) {
  const [project, setProject] = useState<ProjectDataInput>()
  useEffect(() => {
    http.getAuth(`/projects/${projectId}/updating`).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        const data = res?.data as ProjectResponseForUpdating
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
    }
  }

  const handleSubmit = async () => {
    onClose()
  }
  return (
    <>
      <LoadingLayout className='row jcc' style={{ minHeight: '300px' }} isLoading={!project}>
        <FloatLabelInput
          label='Board title'
          input={{ id: 'create-board', name: 'title', autoFocus: true, value: project?.name }}
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
            inputAttributes={{ type: 'checkbox', id: 'set-dute-date', checked: project?.dueDate === undefined }}
            size='small'
            onChange={handleChangeBoard.toggleSetDueDate}
          />
          <label style={{ cursor: 'pointer' }} htmlFor='set-dute-date'>
            I do not want to set due date
          </label>
          {project?.dueDate !== undefined && (
            <input
              type='datetime-local'
              value={getDateTimeString(new Date(project?.dueDate))}
              name='dueDate'
              id='due-date-selector'
              onChange={handleChangeBoard.inputs}
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

        <TextArea
          label='Description (optional)'
          name='description'
          value={project?.description}
          onChange={handleChangeBoard.inputs}
          rows={5}
        />

        <Flex $justifyContent='end'>
          <Button size='medium' onClick={handleSubmit} disabled={!project?.name.trim()} style={{ marginTop: '1rem' }}>
            Save changes
          </Button>
        </Flex>
      </LoadingLayout>
    </>
  )
}

export default UpdateProjectEditor

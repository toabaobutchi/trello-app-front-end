import HttpClient from '@utils/HttpClient'
import { ProjectPageParams, ProjectResponse } from '@utils/types'
import { useCallback, useEffect, useState } from 'react'
import ProjectOptions, { ProjectSelectOptions } from './ProjectOptions'
import { useParams } from 'react-router-dom'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'

const http = new HttpClient()

type ProjectShareState = {
  [projectId: string]: ShareInfo
}

type ShareInfo = {
  projectId: string
  options: ProjectSelectOptions
}

const destructState = (state?: ProjectShareState) => {
  if (!state) return []
  const result = [] as ShareInfo[]
  Object.entries(state).forEach(item => {
    const [_, value] = item
    result.push({
      projectId: value.projectId,
      options: value.options
    })
  })
  return result
}

function ShareProjectByOtherProject() {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [projectShareState, setProjectShareState] = useState<ProjectShareState>()
  const { projectId } = useParams() as ProjectPageParams
  useEffect(() => {
    http.getAuth(`/projects/all?exceptId=${projectId}`).then(res => {
      if (res?.status === 200) {
        const projectsData = res?.data as ProjectResponse[]
        setProjects(projectsData)
      }
    })
  }, [projectId])
  const handleChangeAssignment = useCallback((projectId: string, options: ProjectSelectOptions) => {
    setProjectShareState(prev => ({ ...prev, [projectId]: { projectId, options } }))
  }, [])
  const handleShareProject = () => {
    console.log(destructState(projectShareState))
  }
  return (
    <>
      <div className='tab-content-limit'>
        {projects.map(project => (
          <ProjectOptions onChange={handleChangeAssignment} project={project} key={project.id} />
        ))}
        {projects?.length <= 0 && <p className='text-warning'>You have not worked with anyone yet!</p>}
        <Flex $alignItem='center' $justifyContent='end'>
          {projects?.length > 0 && (
            <Button onClick={handleShareProject} variant='filled'>
              Invite to project
            </Button>
          )}
        </Flex>
      </div>
    </>
  )
}

export default ShareProjectByOtherProject

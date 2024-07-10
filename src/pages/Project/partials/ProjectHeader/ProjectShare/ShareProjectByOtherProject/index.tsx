import HttpClient from '@utils/HttpClient'
import { ProjectResponse } from '@utils/types'
import { useCallback, useEffect, useState } from 'react'
import ProjectOptions, { ProjectSelectOptions } from './ProjectOptions'

const http = new HttpClient()

type ProjectShareState = {
  [projectId: string]: ProjectSelectOptions
}

function ShareProjectByOtherProject() {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [projectShareState, setProjectShareState] = useState<ProjectShareState>()
  useEffect(() => {
    http.getAuth('/projects/all').then(res => {
      if (res?.status === 200) {
        const projectsData = res?.data as ProjectResponse[]
        setProjects(projectsData)
      }
    })
  }, [])
  const handleChangeAssignment = useCallback((projectId: string, options: ProjectSelectOptions) => {
    setProjectShareState(prev => ({ ...prev, [projectId]: options }))
  }, [])
  return (
    <>
      {projects.map(project => (
        <ProjectOptions onChange={handleChangeAssignment} project={project} key={project.id} />
      ))}
    </>
  )
}

export default ShareProjectByOtherProject

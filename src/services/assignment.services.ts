import { http } from '@utils/Axios/HttpClientAuth'
import { AssignmentResponse } from '@utils/types'

const getAssignmentsInProject = async (projectId: string) => {
  const res = await http.get<AssignmentResponse[]>(`/assignments/in-project/${projectId}`)
  return res
}

export { getAssignmentsInProject }

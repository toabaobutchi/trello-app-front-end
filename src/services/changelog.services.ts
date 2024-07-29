import { http } from '@utils/Axios/HttpClientAuth'
import { ChangeLogResponse } from '@utils/types'

const getChangeLogs = async (projectId: string, offset: number = 0, count: number = 20) => {
  const res = await http.get<ChangeLogResponse[]>(`/changelogs/in-project/${projectId}?offset=${offset}&count=${count}`)
  return res
}

export { getChangeLogs }

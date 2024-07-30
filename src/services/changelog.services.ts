import { http } from '@utils/Axios/HttpClientAuth'
import { ChangeLogResponse } from '@utils/types'

const getChangeLogs = async (
  projectId: string,
  date?: number,
  uid?: string,
  offset: number = 1,
  count: number = 20,
) => {
  const res = await http.get<ChangeLogResponse[]>(
    `/changelogs/in-project/${projectId}?offset=${offset}&count=${count}${date !== undefined ? '&date=' + date : ''}${
      uid !== undefined ? '&uid=' + uid : ''
    }`
  )
  return res
}

export { getChangeLogs }

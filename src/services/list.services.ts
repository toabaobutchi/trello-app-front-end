import { http } from '@utils/Axios/HttpClientAuth'
import { CreateListModel, CreateListResponse } from '@utils/types'

const createList = async (model: CreateListModel) => {
  const res = await http.post<CreateListModel, CreateListResponse>('/lists', model)
  return res
}

export { createList }

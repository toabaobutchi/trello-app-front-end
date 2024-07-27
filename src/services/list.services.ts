import { http } from '@utils/Axios/HttpClientAuth'
import {
  CreateListModel,
  CreateListResponse,
  DeletedListResponse,
  UpdatedListResponse,
  UpdateListModel
} from '@utils/types'

const createList = async (model: CreateListModel) => {
  const res = await http.post<CreateListModel, CreateListResponse>('/lists', model)
  return res
}

const updateList = async (listId: string, model: UpdateListModel) => {
  const res = await http.put<UpdateListModel, UpdatedListResponse>(`/lists/${listId}`, model)
  return res
}

const deleteList = async (listId: string) => {
  const res = await http.delete<DeletedListResponse>(`/lists/${listId}`)
  return res
}

const changeListOrder = async (newListOrder: string) => {
  const res = await http.put<{ newListOrder: string }, string>(`/lists/change-order`, { newListOrder })
  return res
}

export { createList, updateList, deleteList, changeListOrder }

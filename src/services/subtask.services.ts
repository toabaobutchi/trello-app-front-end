import { http } from '@utils/Axios/HttpClientAuth'
import { AddSubtasksModel, SubtaskForBoard, SubtaskResponse } from '@utils/types'

const addSubtasks = async (model: AddSubtasksModel) => {
  const res = await http.post<AddSubtasksModel, SubtaskForBoard[]>('/subtasks', model)
  return res
}

const deleteSubtask = async (subtaskId: string | number) => {
  const res = await http.delete<SubtaskResponse>(`/subtasks/${subtaskId}`)
  return res
}

const checkSubtask = async (subtaskId: string | number, checked: boolean) => {
  const res = await http.put<{ isCompleted: boolean }, boolean>(`/subtasks/${subtaskId}/change-status`, {
    isCompleted: checked
  })
  return res
}

const changeSubtaskName = async (subtaskId: string | number, updatedName: string) => {
  const res = await http.put<{ name: string }, string>(`/subtasks/${subtaskId}/change-name`, { name: updatedName })
  return res
}

export { addSubtasks, deleteSubtask, checkSubtask, changeSubtaskName }

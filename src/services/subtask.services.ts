import { http } from '@utils/Axios/HttpClientAuth'
import {
  AddSubtasksModel,
  SubtaskForBoard,
  SubtaskResponse,
  JoinSubtaskResponse,
  AssignSubtaskResponse,
  UnassignSubtaskResponse
} from '@utils/types/subtask.type'

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

const joinSubtask = async (subtaskId: string | number) => {
  const res = await http.postWithoutData<JoinSubtaskResponse>(`/subtasks/${subtaskId}/join`)
  return res
}

const assignSubtask = async (subtaskId: string | number, assignmentId: string) => {
  const res = await http.post<{ assignmentId: string }, AssignSubtaskResponse>(`/subtasks/${subtaskId}/assign`, {
    assignmentId
  })
  return res
}

const unassignSubtask = async (subtaskId: string | number, assignmentId: string) => {
  const res = await http.post<{ assignmentId: string }, UnassignSubtaskResponse>(`/subtasks/${subtaskId}/unassign`, {
    assignmentId
  })
  return res
}

export { addSubtasks, deleteSubtask, checkSubtask, changeSubtaskName, joinSubtask, assignSubtask, unassignSubtask }

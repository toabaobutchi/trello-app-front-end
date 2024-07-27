import { InheritOptions } from '@comps/TaskCard/TaskDetail/DuplicateTask'
import { http } from '@utils/Axios/HttpClientAuth'
import {
  ChangeTaskOrderModel,
  ChangeTaskOrderResponse,
  CreateTaskModel,
  CreateTaskResponse,
  DeletedTaskResponse,
  InTrashTaskResponse,
  JoinTaskResponse,
  MarkedTaskResponse,
  MarkTaskModel,
  TaskDetailForBoard,
  TaskResponseForBoard,
  UpdatedTaskResponse,
  UpdateTaskModel
} from '@utils/types'

const changeTaskOrder = async (taskId: string, model: ChangeTaskOrderModel) => {
  const res = http.put<ChangeTaskOrderModel, ChangeTaskOrderResponse>(`/tasks/${taskId}/change-order`, model)
  return res
}

const getTaskDetail = async (taskId: string) => {
  const res = await http.get<TaskDetailForBoard>(`/tasks/${taskId}/v/board`)
  return res
}

const markTask = async (taskId: string, model: MarkTaskModel) => {
  const res = await http.put<MarkTaskModel, MarkedTaskResponse>(`/tasks/${taskId}/mark`, model)
  return res
}

const joinTask = async (taskId: string) => {
  const res = await http.postWithoutData<JoinTaskResponse>(`/tasks/${taskId}/join`)
  return res
}

const duplicateTask = async (taskId: string, options: InheritOptions) => {
  const res = await http.post<InheritOptions, TaskResponseForBoard[]>(`/tasks/${taskId}/duplicate`, options)
  return res
}

const getRecycleBin = async (projectId: string) => {
  const res = await http.get<InTrashTaskResponse[]>(`/projects/${projectId}/recycle-bin`)
  return res
}

const updateTask = async (taskId: string, model: UpdateTaskModel) => {
  const res = await http.put<UpdateTaskModel, UpdatedTaskResponse>(`/tasks/${taskId}`, model)
  return res
}

const addNewTask = async (model: CreateTaskModel) => {
  const res = await http.post<CreateTaskModel, CreateTaskResponse>('/tasks', model)
  return res
}
const deleteTask = async (taskId: string, moveToTrash: boolean = false) => {
  const res = await http.delete<DeletedTaskResponse>(`/tasks/${taskId}/${moveToTrash ? 'move-to-trash' : ''}`)
  return res
}

export {
  changeTaskOrder,
  getRecycleBin,
  getTaskDetail,
  markTask,
  joinTask,
  duplicateTask,
  updateTask,
  addNewTask,
  deleteTask
}

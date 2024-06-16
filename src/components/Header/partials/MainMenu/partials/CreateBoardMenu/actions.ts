import { EActionType } from './reducer'

const mainMenu = {
  open(element: HTMLElement) {
    return { type: EActionType.MAIN_MENU, element }
  },
  close() {
    return { type: EActionType.CLOSE_MENU }
  },
  back() {
    return { type: EActionType.MAIN_MENU }
  }
}

const boardMenu = {
  open() {
    return { type: EActionType.ADD_BOARD_MENU }
  },
  changeTitle(data: string) {
    return { type: EActionType.CHANGE_BOARD_INFO, data: { title: data } }
  },
  useColor(isUsed: boolean) {
    return { type: EActionType.CHANGE_BOARD_INFO, data: { color: isUsed ? '' : undefined } }
  },
  changeColor(data: string) {
    return { type: EActionType.CHANGE_BOARD_INFO, data: { color: data } }
  },
  changeSelectedWorkspace(data: string) {
    return { type: EActionType.CHANGE_BOARD_INFO, data: { selectedWorkspace: data } }
  }
}

const workspaceMenu = {
  open() {
    return { type: EActionType.ADD_WORKSPACE_MENU }
  },
  changeTitle(data: string) {
    return { type: EActionType.CHANGE_WORKSPACE_INFO, data: { title: data } }
  },
  changeDescription(data: string) {
    return { type: EActionType.CHANGE_WORKSPACE_INFO, data: { description: data } }
  }
}

const joinBoardMenu = {
  open() {
    return { type: EActionType.JOIN_BOARD_MENU }
  },
  changeBoardId(data: string) {
    return { type: EActionType.CHANGE_JOIN_BOARD_INFO, data: { boardId: data } }
  }
}


export { mainMenu, boardMenu, workspaceMenu, joinBoardMenu }

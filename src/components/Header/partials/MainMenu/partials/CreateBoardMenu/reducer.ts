export enum EActionType {
  MAIN_MENU,
  ADD_BOARD_MENU,
  CHANGE_BOARD_INFO,
  CHANGE_WORKSPACE_INFO,
  ADD_WORKSPACE_MENU,
  JOIN_BOARD_MENU,
  CHANGE_JOIN_BOARD_INFO,
  CLOSE_MENU,
  SET_ERROR
}

export type Action = {
  type: EActionType
  element?: HTMLElement | null
  data?: string | null | object
}

export type State = {
  anchorEl: HTMLElement | null
  openMenu?: EActionType
  board?: {
    title?: string
    color?: string
    selectedWorkspace?: string
  }
  workspace?: {
    title?: string
    description?: string
  }
  joinBoard?: {
    boardId?: string
  }
}

export const reducer = (state: State, action: Action) => {
  const prev = { ...state } as State
  switch (action.type) {
    case EActionType.MAIN_MENU:
      return {
        ...prev,
        openMenu: EActionType.MAIN_MENU,
        anchorEl: action.element ?? prev.anchorEl // mở menu, set phần tử anchorEl
      } as State
    case EActionType.ADD_BOARD_MENU:
      return {
        ...prev,
        openMenu: EActionType.ADD_BOARD_MENU,
        board: {}
      }
    case EActionType.CHANGE_BOARD_INFO:
      return {
        ...prev,
        openMenu: EActionType.ADD_BOARD_MENU,
        board: {
          ...prev.board,
          ...(action.data as object)
        }
      }
    case EActionType.CHANGE_WORKSPACE_INFO:
      return {
        ...prev,
        openMenu: EActionType.ADD_WORKSPACE_MENU,
        workspace: {
          ...prev.workspace,
          ...(action.data as object)
        }
      }
    case EActionType.CHANGE_JOIN_BOARD_INFO:
      return {
        ...prev,
        openMenu: EActionType.JOIN_BOARD_MENU,
        joinBoard: {
          ...prev.joinBoard,
          ...(action.data as object)
        }
      }
    case EActionType.ADD_WORKSPACE_MENU:
      return {
        ...prev,
        error: null,
        openMenu: EActionType.ADD_WORKSPACE_MENU,
        workspace: {
          title: '',
          description: ''
        }
      } as State
    case EActionType.JOIN_BOARD_MENU:
      return {
        ...prev,
        openMenu: EActionType.JOIN_BOARD_MENU,
        joinBoard: {
          boardId: ''
        }
      } as State
    case EActionType.CLOSE_MENU:
      return { ...prev, openMenu: EActionType.CLOSE_MENU } as State
    case EActionType.SET_ERROR:
      return {
        ...prev,
        error: action.data as string
      }
    default:
      return prev
  }
}

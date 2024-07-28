enum ActionType {
  TOGGLE_MENU,
  CLOSE_MENU,
  MOBILE_MAIN_MENU
}

type Action = {
  type: ActionType
  payload?: {
    element?: HTMLElement
    data?: string
  }
}

type State = {
  anchorEl?: HTMLElement | null
  openMenu?: string
}

export { ActionType }
export type { Action, State }

export enum EActionType {
  OPEN_MAINMENU,
  OPEN_WIPMENU,
  CLOSEMENU,
  BACKTOMAINMENU
}

export type Action = {
  type: EActionType
  payload?: unknown
}

export type State = {
  openMenu?: EActionType
  anchorEl?: HTMLElement
}

export const initialState: State = {
  openMenu: undefined,
  anchorEl: undefined
}

export const reducer = (state: State, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case EActionType.OPEN_MAINMENU:
      return {
        ...state,
        openMenu: EActionType.OPEN_MAINMENU,
        anchorEl: state?.anchorEl ?? (payload as HTMLElement)
      }
    case EActionType.OPEN_WIPMENU:
      return {
        ...state,
        openMenu: EActionType.OPEN_WIPMENU
      }
    case EActionType.CLOSEMENU:
      return {
       ...state,
        openMenu: undefined,
        // anchorEl: undefined
      }
    case EActionType.BACKTOMAINMENU:
      return {
       ...state,
        openMenu: EActionType.OPEN_MAINMENU
      }
    default:
      return state
  }
}

export const actions = {
  openMainMenu: (element?: HTMLElement) => ({
    type: EActionType.OPEN_MAINMENU,
    payload: element
  }),
  openWIPMenu: () => ({
    type: EActionType.OPEN_WIPMENU
  }),
  closeMenu: () => ({
    type: EActionType.CLOSEMENU
  }),
  backToMainMenu: () => ({
    type: EActionType.BACKTOMAINMENU
  })
}
import { Action, ActionType, State } from './types'

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.TOGGLE_MENU:
      return {
        ...state,
        anchorEl: action.payload?.element,
        openMenu: state.openMenu && state.openMenu === action.payload?.data ? '' : action.payload?.data
      }
    case ActionType.CLOSE_MENU:
      return {
        ...state,
        openMenu: ''
      }
    case ActionType.MOBILE_MAIN_MENU:
      return {
        ...state,
        openMenu: action.payload?.data
      }
    default:
      return state
  }
}

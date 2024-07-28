import { Action, ActionType } from './types'

function toggleMenu(e: HTMLElement, openMenu: string) {
  return { type: ActionType.TOGGLE_MENU, payload: { element: e, data: openMenu } } as Action
}

function closeMenu() {
  return { type: ActionType.CLOSE_MENU } as Action
}

function mobileOpenMenu(openMenu: string) {
  return { type: ActionType.MOBILE_MAIN_MENU, payload: { data: openMenu } }
}

export { toggleMenu, closeMenu, mobileOpenMenu }

export type RegisterHub = {
  [key: string]: {
    send?: {
      [key: string]: string
    }
    receive?: {
      [key: string]: string
    }
  }
}

export const hubs: RegisterHub[] = [
  {
    dragHub: {
      send: {
        startDragList: 'SendStartDragList'
      }
    }
  }
]

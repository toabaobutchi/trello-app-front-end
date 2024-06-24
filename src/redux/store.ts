import { configureStore } from '@reduxjs/toolkit'
import { defaultLayoutSlice } from '@layouts/DefaultLayout/DefaultLayoutSlice'
import { loginSlice } from '@pages/Welcome/LoginSlice'
import { workspaceSlice } from './WorkspaceSlice'
import { projectSlice } from './ProjectSlice'
const store = configureStore({
  reducer: {
    sideBar: defaultLayoutSlice.reducer,
    login: loginSlice.reducer,
    workspaces: workspaceSlice.reducer,
    project: projectSlice.reducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store

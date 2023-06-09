import { configureStore } from '@reduxjs/toolkit'
import courseReducer from '../slice/CourseSlice'

const store = configureStore({
  reducer: {
    course: courseReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store

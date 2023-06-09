import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Course {
  title: string
  description: string
}

interface CourseState {
  courses: Course[]
}

const initialState: CourseState = {
  courses: []
}

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload)
    }
  }
})

export const { addCourse } = courseSlice.actions
export default courseSlice.reducer

import axiosInstance from '../config/axiosInstance'
export interface Student {
    id: number
    name: string
    stack: string
    courseslist: string[]
    coursetitles: any[]
    email: string
    user_role: string
    username: string
    _id: string
    courses: any[]
  }
const getAllStudents = async () => (
  await axiosInstance('/all-students', {
    method: 'GET'
  })
    .then((resp) => resp)
    .catch((err) => {
      console.log(err)
    })
)

export default getAllStudents

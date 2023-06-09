import axiosInstance from '../config/axiosInstance'

const getAllUsers = async () => {
  axiosInstance('/all-users', {
    method: 'GET'
  })
    .then((resp) => resp)
    .catch((err) => {
      console.log(err)
    })
}

export default getAllUsers

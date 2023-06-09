import axiosInstance from '../config/axiosInstance'

const signUp = async (payload: string) => {
  axiosInstance('/signup', {
    method: 'POST',
    data: payload
  }).then((resp) => resp)
}

export default signUp

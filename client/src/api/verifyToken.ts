import axiosInstance from '../config/axiosInstance'

const verifyToken = async (payload: string) => {
  axiosInstance(`/verify-email/${payload}`, {
    method: 'GET'
  }).then((resp) => resp)
}

export default verifyToken

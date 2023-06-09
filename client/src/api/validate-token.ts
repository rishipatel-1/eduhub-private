import axiosInstance from '../config/axiosInstance'

const validateToken = async (payload: string) => {
  axiosInstance(`/validate?token=${payload}`, {
    method: 'GET'
  })
    .then((resp) => resp)
    .catch((err) => {
      console.log(err)
    })
}

export default validateToken

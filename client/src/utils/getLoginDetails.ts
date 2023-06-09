import { getCookie } from 'react-use-cookie'
import jwtDecode, { JwtDecodeOptions } from 'jwt-decode'

const getLoginDetails = () => {
  const token = getCookie('token')

  try {
    const decoded = jwtDecode(token, { key: 'takeaguess' } as unknown as JwtDecodeOptions)
    return decoded
  } catch (err) {
    return {}
  }
}

export default getLoginDetails

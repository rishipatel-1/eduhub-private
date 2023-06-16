/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axiosInstance from '../config/axiosInstance'

export const verifyToken = async (payload: any) => (
  await axiosInstance(`/verify-email/${payload}`, {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const validateToken = async (payload: any) => (
  await axiosInstance(`/validate?token=${payload}`, {
    method: 'GET'
  })
    .then((resp) => resp)
    .catch((err) => {
      console.log(err)
    })
)

export const signUp = async (payload: any) => (
  await axiosInstance('/signup', {
    method: 'POST',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const login = async (payload: any) => (
  await axiosInstance('/login', {
    method: 'POST',
    data: payload
  })
    .then((resp) => resp)
    .catch((err) => {
      console.log(err)
    })
)

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance('/all-users', {
      method: 'GET'
    })
    return response.data
  } catch (err) {
    console.log(err)
    return []
  }
}

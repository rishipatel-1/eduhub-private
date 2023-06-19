/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axiosInstance from '../config/axiosInstance'

export const addCourses = async (payload: any) => (
  await axiosInstance('/addCourse', {
    method: 'POST',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const updateCourse = async (courseId: string, payload: any) => (
  await axiosInstance(`/updateCourse/${courseId}`, {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const enrollStudent = async (courseId: string, payload: any) => (
  await axiosInstance(`/enroll_student/${courseId}`, {
    method: 'POST',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const enrollmultiplecourses = async (payload: any) => (
  await axiosInstance('/enroll_multiple_students/', {
    method: 'POST',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const updateEnrollment = async (payload: any) => (
  await axiosInstance('/updateEnrollments/', {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const deleteCourse = async (courseId: string) => (
  await axiosInstance(`/deleteCourse/${courseId}`, {
    method: 'DELETE'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getAllCourses = async () => (
  await axiosInstance('/getAllCourses', {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getCourses = async () => (
  await axiosInstance('/getCourses', {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const removeEnrollment = async (payload: any) => (
  await axiosInstance('/removeEnrollment', {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const removeEnrollments = async (payload: any) => (
  await axiosInstance('/deleteEnrollments', {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getCourseById = async (payload: any) => (
  await axiosInstance(`/getCourseById/${payload}`, {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getCourseProgress = async (payload: any) => (
  await axiosInstance(`/getCourseProgress/${payload}`, {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getAllCoursesAndStudents = async () => (
  await axiosInstance('/getAllStudentAndCourses/', {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

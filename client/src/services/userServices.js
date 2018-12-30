import axios from 'axios'
import { getConfig } from './servicehelpers'

const baseUrl = '/api/users'

const register = async (user) => {
  const response = await axios.post(`${baseUrl}/register`, user)
  return response.data
}

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  if (response.data) {
    localStorage.setItem('luppiouser', JSON.stringify(response.data))
  }
  return response.data
}

const logout = () => {
  localStorage.removeItem('luppiouser')
}

export default {
  login,
  logout,
  register
}
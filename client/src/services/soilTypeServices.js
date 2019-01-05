import axios from 'axios'
import { getConfig } from './servicehelpers'

const baseUrl = '/api/soiltypes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addSoilType = async (soilType) => {
  console.log('Creating (soilTypeServices.js)', soilType)
  const response = await axios.post(baseUrl, soilType, getConfig())
  console.log('Received (soilTypeServices.js):', response.data)
  return response.data
}

const updateSoilType = async (soilType) => {
  console.log('Updating (soilTypeServices.js)', soilType)
  const response = await axios.put(`${baseUrl}/${soilType._id}`, soilType, getConfig())
  console.log('Received (soilTypeServices.js):', response.data)
  return response.data
}

const removeSoilType = async (id) => {
  console.log('Removing (soilTypeServices.js)', id)
  const response = await axios.delete(`${baseUrl}/${id}`)
  console.log('Received (soilTypeServices.js):', response.data, getConfig())
  return response.data
}

export default {
  getAll,
  addSoilType,
  updateSoilType,
  removeSoilType
}
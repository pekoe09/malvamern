import axios from 'axios'
import { getConfig } from './servicehelpers'

const baseUrl = '/api/'

const getAll = async (entityPlural) => {
  const response = await axios.get(`${baseUrl}/${entityPlural}`)
  return response.data
}

const addEntity = async (entityPlural, entity) => {
  console.log('Creating (entityServices.js)', entityPlural, entity)
  const response = await axios.post(`${baseUrl}/${entityPlural}`, entity, getConfig())
  console.log('Received (entityServices.js):', response.data)
  return response.data
}

const updateEntity = async (entityPlural, entity) => {
  console.log('Updating (entityServices.js)', entityPlural, entity)
  const response = await axios.put(`${baseUrl}/${entityPlural}/${entity._id}`, entity, getConfig())
  console.log('Received (entityServices.js):', response.data)
  return response.data
}

const removeEntity = async (entityPlural, id) => {
  console.log('Removing (entityServices.js)', id)
  const response = await axios.delete(`${baseUrl}/${entityPlural}/${id}`, getConfig())
  console.log('Received (entityServices.js):', response.data)
  return response.data
}

export default {
  getAll,
  addEntity,
  updateEntity,
  removeEntity
}
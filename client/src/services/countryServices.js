import axios from 'axios'
import { getConfig } from './servicehelpers'

const baseUrl = '/api/countries'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addCountry = async (country) => {
  console.log('Creating (countryservices.js)', country)
  const response = await axios.post(baseUrl, country, getConfig())
  console.log('Received (countryServices.js):', response.data)
  return response.data
}

const updateCountry = async (country) => {
  console.log('Updating (countryservices.js)', country)
  const response = await axios.put(`${baseUrl}/${country._id}`, country, getConfig())
  console.log('Received (countryServices.js):', response.data)
  return response.data
}

const removeCountry = async (id) => {
  console.log('Removing (countryservices.js)', id)
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  console.log('Received (countryServices.js):', response.data)
  return response.data
}

export default {
  getAll,
  addCountry,
  updateCountry,
  removeCountry
}
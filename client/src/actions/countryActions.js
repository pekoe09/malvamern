import countryService from '../services/countryServices'

export const COUNTRIES_GETALL_BEGIN = 'COUNTRIES_GETALL_BEGIN'
export const COUNTRIES_GETALL_SUCCESS = 'COUNTRIES_GETALL_SUCCESS'
export const COUNTRIES_GETALL_FAILURE = 'COUNTRIES_GETALL_FAILURE'
export const COUNTRY_CREATE_BEGIN = 'COUNTRIES_CREATE_BEGIN'
export const COUNTRY_CREATE_SUCCESS = 'COUNTRY_CREATE_SUCCESS'
export const COUNTRY_CREATE_FAILURE = 'COUNTRY_CREATE_FAILURE'
export const COUNTRY_UPDATE_BEGIN = 'COUNTRY_UPDATE_BEGIN'
export const COUNTRY_UPDATE_SUCCESS = 'COUNTRY_UPDATE_SUCCESS'
export const COUNTRY_UDPATE_FAILURE = 'COUNTRY_UPDATE_FAILURE'
export const COUNTRY_DELETE_BEGIN = 'COUNTRY_DELETE_BEGIN'
export const COUNTRY_DELETE_SUCCESS = 'COUNTRY_DELETE_SUCCESS'
export const COUNTRY_DELETE_FAILURE = 'COUNTRY_DELETE_FAILURE'

const getAllCountriesBegin = () => ({
  type: COUNTRIES_GETALL_BEGIN
})

const getAllCountriesSuccess = countries => ({
  type: COUNTRIES_GETALL_SUCCESS,
  payload: { countries }
})

const getAllCountriesFailure = error => ({
  type: COUNTRIES_GETALL_FAILURE,
  payload: { error }
})

const addCountryBegin = () => ({
  type: COUNTRY_CREATE_BEGIN
})

const addCountrySuccess = country => ({
  type: COUNTRY_CREATE_SUCCESS,
  payload: { country }
})

const addCountryFailure = error => ({
  type: COUNTRY_CREATE_FAILURE,
  payload: { error }
})

const updateCountryBegin = () => ({
  type: COUNTRY_UPDATE_BEGIN
})

const updateCountrySuccess = country => ({
  type: COUNTRY_UPDATE_SUCCESS,
  payload: { country }
})

const updateCountryFailure = error => ({
  type: COUNTRY_UDPATE_FAILURE,
  payload: { error }
})

const deleteCountryBegin = () => ({
  type: COUNTRY_DELETE_BEGIN
})

const deleteCountrySuccess = id => ({
  type: COUNTRY_DELETE_SUCCESS,
  payload: { id }
})

const deleteCountryFailure = error => ({
  type: COUNTRY_DELETE_FAILURE,
  payload: { error }
})

export const getAllCountries = () => {
  return async (dispatch) => {
    dispatch(getAllCountriesBegin())
    try {
      const countries = await countryService.getAll()
      dispatch(getAllCountriesSuccess(countries))
    } catch (error) {
      console.log(error)
      dispatch(getAllCountriesFailure(error))
    }
  }
}

export const addCountry = (country) => {
  return async (dispatch) => {
    dispatch(addCountryBegin())
    try {
      country = await countryService.addCountry(country)
      dispatch(addCountrySuccess(country))
    } catch (error) {
      console.log(error)
      dispatch(addCountryFailure(error))
    }
  }
}

export const updateCountry = (country) => {
  return async (dispatch) => {
    dispatch(updateCountryBegin())
    try {
      country = await countryService.updateCountry(country)
      dispatch(updateCountrySuccess(country))
    } catch (error) {
      console.log(error)
      dispatch(updateCountryFailure(error))
    }
  }
}

export const deleteCountry = (id) => {
  return async (dispatch) => {
    dispatch(deleteCountryBegin())
    try {
      await countryService.removeCountry(id)
      dispatch(deleteCountrySuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deleteCountryFailure(error))
    }
  }
}
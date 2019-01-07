import soilTypeService from '../services/soilTypeServices'

export const SOILTYPES_GETALL_BEGIN = 'SOILTYPES_GETALL_BEGIN'
export const SOILTYPES_GETALL_SUCCESS = 'SOILTYPES_GETALL_SUCCESS'
export const SOILTYPES_GETALL_FAILURE = 'SOILTYPES_GETALL_FAILURE'
export const SOILTYPE_CREATE_BEGIN = 'SOILTYPES_CREATE_BEGIN'
export const SOILTYPE_CREATE_SUCCESS = 'SOILTYPE_CREATE_SUCCESS'
export const SOILTYPE_CREATE_FAILURE = 'SOILTYPE_CREATE_FAILURE'
export const SOILTYPE_UPDATE_BEGIN = 'SOILTYPE_UPDATE_BEGIN'
export const SOILTYPE_UPDATE_SUCCESS = 'SOILTYPE_UPDATE_SUCCESS'
export const SOILTYPE_UDPATE_FAILURE = 'SOILTYPE_UPDATE_FAILURE'
export const SOILTYPE_DELETE_BEGIN = 'SOILTYPE_DELETE_BEGIN'
export const SOILTYPE_DELETE_SUCCESS = 'SOILTYPE_DELETE_SUCCESS'
export const SOILTYPE_DELETE_FAILURE = 'SOILTYPE_DELETE_FAILURE'

const getAllSoilTypesBegin = () => ({
  type: SOILTYPES_GETALL_BEGIN
})

const getAllSoilTypesSuccess = soilTypes => ({
  type: SOILTYPES_GETALL_SUCCESS,
  payload: { soilTypes }
})

const getAllSoilTypesFailure = error => ({
  type: SOILTYPES_GETALL_FAILURE,
  payload: { error }
})

const addSoilTypeBegin = () => ({
  type: SOILTYPE_CREATE_BEGIN
})

const addSoilTypeSuccess = soilType => ({
  type: SOILTYPE_CREATE_SUCCESS,
  payload: { soilType }
})

const addSoilTypeFailure = error => ({
  type: SOILTYPE_CREATE_FAILURE,
  payload: { error }
})

const updateSoilTypeBegin = () => ({
  type: SOILTYPE_UPDATE_BEGIN
})

const updateSoilTypeSuccess = soilType => ({
  type: SOILTYPE_UPDATE_SUCCESS,
  payload: { soilType }
})

const updateSoilTypeFailure = error => ({
  type: SOILTYPE_UDPATE_FAILURE,
  payload: { error }
})

const deleteSoilTypeBegin = () => ({
  type: SOILTYPE_DELETE_BEGIN
})

const deleteSoilTypeSuccess = id => ({
  type: SOILTYPE_DELETE_SUCCESS,
  payload: { id }
})

const deleteSoilTypeFailure = error => ({
  type: SOILTYPE_DELETE_FAILURE,
  payload: { error }
})

export const getAllSoilTypes = () => {
  return async (dispatch) => {
    dispatch(getAllSoilTypesBegin())
    try {
      const soilTypes = await soilTypeService.getAll()
      dispatch(getAllSoilTypesSuccess(soilTypes))
    } catch (error) {
      console.log(error)
      dispatch(getAllSoilTypesFailure(error))
    }
  }
}

export const addSoilType = (soilType) => {
  return async (dispatch) => {
    dispatch(addSoilTypeBegin())
    try {
      soilType = await soilTypeService.addSoilType(soilType)
      dispatch(addSoilTypeSuccess(soilType))
    } catch (error) {
      console.log(error)
      dispatch(addSoilTypeFailure(error))
    }
  }
}

export const updateSoilType = (soilType) => {
  return async (dispatch) => {
    dispatch(updateSoilTypeBegin())
    try {
      soilType = await soilTypeService.updateSoilType(soilType)
      dispatch(updateSoilTypeSuccess(soilType))
    } catch (error) {
      console.log(error)
      dispatch(updateSoilTypeFailure(error))
    }
  }
}

export const deleteSoilType = (id) => {
  return async (dispatch) => {
    dispatch(deleteSoilTypeBegin())
    try {
      await soilTypeService.removeSoilType(id)
      dispatch(deleteSoilTypeSuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deleteSoilTypeFailure(error))
    }
  }
}
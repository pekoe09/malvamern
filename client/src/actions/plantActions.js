import entityService from '../services/entityServices'

export const PLANTS_GETCOUNT_BEGIN = 'PLANTS_GETCOUNT_BEGIN'
export const PLANTS_GETCOUNT_SUCCESS = 'PLANTS_GETCOUNT_SUCCESS'
export const PLANTS_GETCOUNT_FAILURE = 'PLANTS_GETCOUNT_FAILURE'
export const PLANTS_GETALL_BEGIN = 'PLANTS_GETALL_BEGIN'
export const PLANTS_GETALL_SUCCESS = 'PLANTS_GETALL_SUCCESS'
export const PLANTS_GETALL_FAILURE = 'PLANTS_GETALL_FAILURE'
export const PLANTS_GETBYPAGE_BEGIN = 'PLANTS_GETBYPAGE_BEGIN'
export const PLANTS_GETBYPAGE_SUCCESS = 'PLANTS_GETBYPAGE_SUCCESS'
export const PLANTS_GETBYPAGE_FAILURE = 'PLANTS_GETBYPAGE_FAILURE'
export const PLANT_GET_BEGIN = 'PLANT_GET_BEGIN'
export const PLANT_GET_SUCCESS = 'PLANT_GET_SUCCESS'
export const PLANT_GET_FAILURE = 'PLANT_GET_FAILURE'
export const PLANT_CREATE_BEGIN = 'PLANTS_CREATE_BEGIN'
export const PLANT_CREATE_SUCCESS = 'PLANT_CREATE_SUCCESS'
export const PLANT_CREATE_FAILURE = 'PLANT_CREATE_FAILURE'
export const PLANT_UPDATE_BEGIN = 'PLANT_UPDATE_BEGIN'
export const PLANT_UPDATE_SUCCESS = 'PLANT_UPDATE_SUCCESS'
export const PLANT_UDPATE_FAILURE = 'PLANT_UPDATE_FAILURE'
export const PLANT_DELETE_BEGIN = 'PLANT_DELETE_BEGIN'
export const PLANT_DELETE_SUCCESS = 'PLANT_DELETE_SUCCESS'
export const PLANT_DELETE_FAILURE = 'PLANT_DELETE_FAILURE'

const getPlantCountBegin = () => ({
  type: PLANTS_GETCOUNT_BEGIN
})

const getPlantCountSuccess = count => ({
  type: PLANTS_GETCOUNT_SUCCESS,
  payload: { count }
})

const getPlantCountFailure = error => ({
  type: PLANTS_GETCOUNT_FAILURE,
  payload: { error }
})

const getAllPlantsBegin = () => ({
  type: PLANTS_GETALL_BEGIN
})

const getAllPlantsSuccess = plants => ({
  type: PLANTS_GETALL_SUCCESS,
  payload: { plants }
})

const getAllPlantsFailure = error => ({
  type: PLANTS_GETALL_FAILURE,
  payload: { error }
})

const getPlantsByPageBegin = () => ({
  type: PLANTS_GETBYPAGE_BEGIN
})

const getPlantsByPageSuccess = plants => ({
  type: PLANTS_GETBYPAGE_SUCCESS,
  payload: { plants }
})

const getPlantsByPageFailure = error => ({
  type: PLANTS_GETBYPAGE_FAILURE,
  payload: { error }
})

const getPlantBegin = () => ({
  type: PLANT_GET_BEGIN
})

const getPlantSuccess = plant => ({
  type: PLANT_GET_SUCCESS,
  payload: { plant }
})

const getPlantFailure = error => ({
  type: PLANT_GET_FAILURE,
  payload: { error }
})

const addPlantBegin = () => ({
  type: PLANT_CREATE_BEGIN
})

const addPlantSuccess = plant => ({
  type: PLANT_CREATE_SUCCESS,
  payload: { plant }
})

const addPlantFailure = error => ({
  type: PLANT_CREATE_FAILURE,
  payload: { error }
})

const updatePlantBegin = () => ({
  type: PLANT_UPDATE_BEGIN
})

const updatePlantSuccess = plant => ({
  type: PLANT_UPDATE_SUCCESS,
  payload: { plant }
})

const updatePlantFailure = error => ({
  type: PLANT_UDPATE_FAILURE,
  payload: { error }
})

const deletePlantBegin = () => ({
  type: PLANT_DELETE_BEGIN
})

const deletePlantSuccess = id => ({
  type: PLANT_DELETE_SUCCESS,
  payload: { id }
})

const deletePlantFailure = error => ({
  type: PLANT_DELETE_FAILURE,
  payload: { error }
})

export const getPlantCount = () => {
  return async (dispatch) => {
    dispatch(getPlantCountBegin())
    try {
      const count = await entityService.getCount('plants')
      dispatch(getPlantCountSuccess(count))
    } catch (error) {
      console.log(error)
      dispatch(getPlantCountFailure(error))
    }
  }
}

export const getAllPlants = () => {
  return async (dispatch) => {
    dispatch(getAllPlantsBegin())
    try {
      const plants = await entityService.getAll('plants')
      dispatch(getAllPlantsSuccess(plants))
    } catch (error) {
      console.log(error)
      dispatch(getAllPlantsFailure(error))
    }
  }
}

export const getPlantsByPage = (page, limit, criteria) => {
  return async (dispatch) => {
    dispatch(getPlantsByPageBegin())
    try {
      const plants = await entityService.getByPage('plants', page, limit, criteria)
      dispatch(getPlantsByPageSuccess(plants))
    } catch (error) {
      console.log(error)
      dispatch(getPlantsByPageFailure(error))
    }
  }
}

export const getPlant = (_id) => {
  return async (dispatch) => {
    dispatch(getPlantBegin())
    try {
      const plant = await entityService.getOne('plants', _id)
      dispatch(getPlantSuccess(plant))
    } catch (error) {
      console.log(error)
      dispatch(getPlantFailure(error))
    }
  }
}

export const addPlant = (plant) => {
  return async (dispatch) => {
    dispatch(addPlantBegin())
    try {
      plant = await entityService.addEntity('plants', plant)
      dispatch(addPlantSuccess(plant))
    } catch (error) {
      console.log(error)
      dispatch(addPlantFailure(error))
    }
  }
}

export const updatePlant = (plant) => {
  return async (dispatch) => {
    dispatch(updatePlantBegin())
    try {
      plant = await entityService.updateEntity('plants', plant)
      dispatch(updatePlantSuccess(plant))
    } catch (error) {
      console.log(error)
      dispatch(updatePlantFailure(error))
    }
  }
}

export const deletePlant = (id) => {
  return async (dispatch) => {
    dispatch(deletePlantBegin())
    try {
      await entityService.removeEntity('plants', id)
      dispatch(deletePlantSuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deletePlantFailure(error))
    }
  }
}
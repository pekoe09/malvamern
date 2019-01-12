import entityService from '../services/entityServices'

export const PLANTS_GETALL_BEGIN = 'PLANTS_GETALL_BEGIN'
export const PLANTS_GETALL_SUCCESS = 'PLANTS_GETALL_SUCCESS'
export const PLANTS_GETALL_FAILURE = 'PLANTS_GETALL_FAILURE'
export const PLANT_CREATE_BEGIN = 'PLANTS_CREATE_BEGIN'
export const PLANT_CREATE_SUCCESS = 'PLANT_CREATE_SUCCESS'
export const PLANT_CREATE_FAILURE = 'PLANT_CREATE_FAILURE'
export const PLANT_UPDATE_BEGIN = 'PLANT_UPDATE_BEGIN'
export const PLANT_UPDATE_SUCCESS = 'PLANT_UPDATE_SUCCESS'
export const PLANT_UDPATE_FAILURE = 'PLANT_UPDATE_FAILURE'
export const PLANT_DELETE_BEGIN = 'PLANT_DELETE_BEGIN'
export const PLANT_DELETE_SUCCESS = 'PLANT_DELETE_SUCCESS'
export const PLANT_DELETE_FAILURE = 'PLANT_DELETE_FAILURE'

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
import {
  PLANTS_GETALL_BEGIN,
  PLANTS_GETALL_SUCCESS,
  PLANTS_GETALL_FAILURE,
  PLANT_CREATE_BEGIN,
  PLANT_CREATE_SUCCESS,
  PLANT_CREATE_FAILURE,
  PLANT_UPDATE_BEGIN,
  PLANT_UPDATE_SUCCESS,
  PLANT_UDPATE_FAILURE,
  PLANT_DELETE_BEGIN,
  PLANT_DELETE_SUCCESS,
  PLANT_DELETE_FAILURE
} from '../actions/plantActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const plantReducer = (store = initialState, action) => {
  switch (action.type) {
    case PLANTS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case PLANTS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.plants,
        loading: false,
        error: null
      }
    case PLANTS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case PLANT_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case PLANT_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.plant),
        creating: false,
        error: null
      }
    case PLANT_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case PLANT_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case PLANT_UPDATE_SUCCESS:
      const updated = action.payload.plant
      return {
        ...store,
        items: store.items.map(p => p._id === updated._id ? updated : p),
        updating: false,
        error: null
      }
    case PLANT_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case PLANT_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case PLANT_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(p => p._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case PLANT_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default plantReducer
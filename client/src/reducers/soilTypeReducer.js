import {
  SOILTYPES_GETALL_BEGIN,
  SOILTYPES_GETALL_SUCCESS,
  SOILTYPES_GETALL_FAILURE,
  SOILTYPE_CREATE_BEGIN,
  SOILTYPE_CREATE_SUCCESS,
  SOILTYPE_CREATE_FAILURE,
  SOILTYPE_UPDATE_BEGIN,
  SOILTYPE_UPDATE_SUCCESS,
  SOILTYPE_UDPATE_FAILURE,
  SOILTYPE_DELETE_BEGIN,
  SOILTYPE_DELETE_SUCCESS,
  SOILTYPE_DELETE_FAILURE
} from '../actions/soilTypeActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const soilTypeReducer = (store = initialState, action) => {
  switch (action.type) {
    case SOILTYPES_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case SOILTYPES_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.soilTypes,
        loading: false,
        error: null
      }
    case SOILTYPES_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case SOILTYPE_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case SOILTYPE_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.soilType),
        creating: false,
        error: null
      }
    case SOILTYPE_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case SOILTYPE_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case SOILTYPE_UPDATE_SUCCESS:
      const updated = action.payload.soilType
      return {
        ...store,
        items: store.items.map(s => s._id === updated._id ? updated : s),
        updating: false,
        error: null
      }
    case SOILTYPE_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case SOILTYPE_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case SOILTYPE_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(s => s._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case SOILTYPE_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default soilTypeReducer
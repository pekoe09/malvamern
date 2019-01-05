import {
  COUNTRIES_GETALL_BEGIN,
  COUNTRIES_GETALL_SUCCESS,
  COUNTRIES_GETALL_FAILURE,
  COUNTRY_CREATE_BEGIN,
  COUNTRY_CREATE_SUCCESS,
  COUNTRY_CREATE_FAILURE,
  COUNTRY_UPDATE_BEGIN,
  COUNTRY_UPDATE_SUCCESS,
  COUNTRY_UDPATE_FAILURE,
  COUNTRY_DELETE_BEGIN,
  COUNTRY_DELETE_SUCCESS,
  COUNTRY_DELETE_FAILURE
} from '../actions/countryActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const countryReducer = (store = initialState, action) => {
  switch (action.type) {
    case COUNTRIES_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case COUNTRIES_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.countries,
        loading: false,
        error: null
      }
    case COUNTRIES_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case COUNTRY_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case COUNTRY_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.country),
        creating: false,
        error: null
      }
    case COUNTRY_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case COUNTRY_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case COUNTRY_UPDATE_SUCCESS:
      const updated = action.payload.country
      return {
        ...store,
        items: store.items.map(c => c.id === updated.id ? updated : c),
        updating: false,
        error: null
      }
    case COUNTRY_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case COUNTRY_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case COUNTRY_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c.id !== action.payload.country.id),
        deleting: false,
        error: null
      }
    case COUNTRY_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default countryReducer
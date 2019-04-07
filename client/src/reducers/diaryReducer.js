import {
  ENTRIES_GETALL_BEGIN,
  ENTRIES_GETALL_SUCCESS,
  ENTRIES_GETALL_FAILURE,
  ENTRY_CREATE_BEGIN,
  ENTRY_CREATE_SUCCESS,
  ENTRY_CREATE_FAILURE,
  ENTRY_UPDATE_BEGIN,
  ENTRY_UPDATE_SUCCESS,
  ENTRY_UDPATE_FAILURE,
  ENTRY_DELETE_BEGIN,
  ENTRY_DELETE_SUCCESS,
  ENTRY_DELETE_FAILURE
} from '../actions/diaryActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const diaryReducer = (store = initialState, action) => {
  switch (action.type) {
    case ENTRIES_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case ENTRIES_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.entries,
        loading: false,
        error: null
      }
    case ENTRIES_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case ENTRY_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case ENTRY_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.entry),
        creating: false,
        error: null
      }
    case ENTRY_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case ENTRY_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case ENTRY_UPDATE_SUCCESS:
      const updated = action.payload.entry
      return {
        ...store,
        items: store.items.map(c => c._id === updated._id ? updated : c),
        updating: false,
        error: null
      }
    case ENTRY_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case ENTRY_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case ENTRY_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case ENTRY_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default diaryReducer
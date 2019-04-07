import entityService from '../services/entityServices'

export const ENTRIES_GETALL_BEGIN = 'ENTRIES_GETALL_BEGIN'
export const ENTRIES_GETALL_SUCCESS = 'ENTRIES_GETALL_SUCCESS'
export const ENTRIES_GETALL_FAILURE = 'ENTRIES_GETALL_FAILURE'
export const ENTRY_CREATE_BEGIN = 'ENTRIES_CREATE_BEGIN'
export const ENTRY_CREATE_SUCCESS = 'ENTRY_CREATE_SUCCESS'
export const ENTRY_CREATE_FAILURE = 'ENTRY_CREATE_FAILURE'
export const ENTRY_UPDATE_BEGIN = 'ENTRY_UPDATE_BEGIN'
export const ENTRY_UPDATE_SUCCESS = 'ENTRY_UPDATE_SUCCESS'
export const ENTRY_UDPATE_FAILURE = 'ENTRY_UPDATE_FAILURE'
export const ENTRY_DELETE_BEGIN = 'ENTRY_DELETE_BEGIN'
export const ENTRY_DELETE_SUCCESS = 'ENTRY_DELETE_SUCCESS'
export const ENTRY_DELETE_FAILURE = 'ENTRY_DELETE_FAILURE'

const getAllEntriesBegin = () => ({
  type: ENTRIES_GETALL_BEGIN
})

const getAllEntriesSuccess = entries => ({
  type: ENTRIES_GETALL_SUCCESS,
  payload: { entries }
})

const getAllEntriesFailure = error => ({
  type: ENTRIES_GETALL_FAILURE,
  payload: { error }
})

const addEntryBegin = () => ({
  type: ENTRY_CREATE_BEGIN
})

const addEntrySuccess = entry => ({
  type: ENTRY_CREATE_SUCCESS,
  payload: { entry }
})

const addEntryFailure = error => ({
  type: ENTRY_CREATE_FAILURE,
  payload: { error }
})

const updateEntryBegin = () => ({
  type: ENTRY_UPDATE_BEGIN
})

const updateEntrySuccess = entry => ({
  type: ENTRY_UPDATE_SUCCESS,
  payload: { entry }
})

const updateEntryFailure = error => ({
  type: ENTRY_UDPATE_FAILURE,
  payload: { error }
})

const deleteEntryBegin = () => ({
  type: ENTRY_DELETE_BEGIN
})

const deleteEntrySuccess = id => ({
  type: ENTRY_DELETE_SUCCESS,
  payload: { id }
})

const deleteEntryFailure = error => ({
  type: ENTRY_DELETE_FAILURE,
  payload: { error }
})

export const getAllEntries = () => {
  return async (dispatch) => {
    dispatch(getAllEntriesBegin())
    try {
      const entries = await entityService.getAll('diary')
      dispatch(getAllEntriesSuccess(entries))
    } catch (error) {
      console.log(error)
      dispatch(getAllEntriesFailure(error))
    }
  }
}

export const addEntry = (entry) => {
  return async (dispatch) => {
    dispatch(addEntryBegin())
    try {
      entry = await entityService.addEntity('diary', entry)
      dispatch(addEntrySuccess(entry))
    } catch (error) {
      console.log(error)
      dispatch(addEntryFailure(error))
    }
  }
}

export const updateEntry = (entry) => {
  return async (dispatch) => {
    dispatch(updateEntryBegin())
    try {
      entry = await entityService.updateEntity('diary', entry)
      dispatch(updateEntrySuccess(entry))
    } catch (error) {
      console.log(error)
      dispatch(updateEntryFailure(error))
    }
  }
}

export const deleteEntry = (id) => {
  return async (dispatch) => {
    dispatch(deleteEntryBegin())
    try {
      await entityService.removeEntity('diary', id)
      dispatch(deleteEntrySuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deleteEntryFailure(error))
    }
  }
}
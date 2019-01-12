import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import countryReducer from './reducers/countryReducer'
import plantReducer from './reducers/plantReducer'
import soilTypeReducer from './reducers/soilTypeReducer'
import uiMessageReducer from './reducers/uiMessageReducer'
import userReducer from './reducers/userReducer'

const appReducer = combineReducers({
  countries: countryReducer,
  plants: plantReducer,
  soilTypes: soilTypeReducer,
  uiMessages: uiMessageReducer,
  users: userReducer
})

export const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_SUCCESS') {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`)
    })
    state = undefined
  }
  return appReducer(state, action)
}

export const persistConfig = {
  key: 'luppio',
  storage,
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
)

export const persistor = persistStore(store)
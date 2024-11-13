import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query/react'
import {load, save} from 'redux-localstorage-simple'
import application from './application/reducer'
import user from './user/reducer'
import {updateVersion} from "./global/actions";

const PERSISTED_KEYS: string[] = ['application']
const NAMESPACE =  `swap`

const store = configureStore({
    reducer: {
        application,
        user
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({thunk: true, serializableCheck: false}).concat(
            save({
                states: PERSISTED_KEYS,
                debounce: 1000,
                namespace: NAMESPACE,
                namespaceSeparator: '::',
            })
        )
    },
    preloadedState: load({
        states: PERSISTED_KEYS,
        namespace: NAMESPACE,
        namespaceSeparator: '::',
    }),
})
store.dispatch(updateVersion())

setupListeners(store.dispatch)

export default store
export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { History, createBrowserHistory } from 'history'
import reduxThunk from 'redux-thunk'
import { userReducer } from './user/reducers';
import User from '../models/user.model';
import addMetamaskListeners from './metamaskListeners'

export const rootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    user: userReducer
})

export type AppState = {
    router: RouterState,
    user: User
}
export const history = createBrowserHistory()

export default function configureStore() {
    const store = createStore(
        rootReducer(history),
        compose(
            applyMiddleware(
                reduxThunk,
                routerMiddleware(history)
            ),
        )
    )

    addMetamaskListeners(store.dispatch, store.getState)

    return store
}
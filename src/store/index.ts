import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { History, createBrowserHistory } from 'history'
import reduxThunk from 'redux-thunk'
import { userReducer } from './user/reducers';
import { ethereumReducer } from './ethereum/reducers'
import User from '../models/user.model';
import addMetamaskListeners from './metamaskListeners'
import EthereumWeb3 from '../models/ethereumWeb3.model';
import { reducer as formReducer } from 'redux-form'

export const rootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    form: formReducer,
    user: userReducer,
    ethereumWeb3: ethereumReducer
})

export type AppState = {
    router: RouterState,
    user: User,
    ethereumWeb3: EthereumWeb3
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
    
    if (window.ethereum)
        addMetamaskListeners(store.dispatch, store.getState)

    return store
}
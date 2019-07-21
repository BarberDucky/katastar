import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History, createBrowserHistory } from 'history'

export const rootReducer = (history: History) => combineReducers({
    router: connectRouter(history)
})

export const history = createBrowserHistory()

export default function configureStore() {
    const store = createStore(
        rootReducer(history),
        compose(
            applyMiddleware(
                routerMiddleware(history)
            )
        )
    )

    return store
}
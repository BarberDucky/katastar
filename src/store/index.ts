import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { History, createBrowserHistory } from 'history'
import reduxThunk from 'redux-thunk'
import { userReducer } from './user/reducers'
import { ethereumReducer } from './ethereum/reducers'
import User from '../models/user.model'
import addMetamaskListeners from './metamaskListeners'
import EthereumWeb3 from '../models/ethereumWeb3.model'
import { conversationReducer } from './current-conversation/reducers'
import Conversation from '../models/conversation.model'
import { dealReducer } from './current-deal/reducers'
import Deal from '../models/deal.model'

export const rootReducer = (history: History) => combineReducers({
	router: connectRouter(history),
	user: userReducer,
	ethereumWeb3: ethereumReducer,
	currentConversation: conversationReducer,
	currentDeal: dealReducer,
})

export type AppState = {
	router: RouterState
	user: User
	ethereumWeb3: EthereumWeb3
	currentConversation: Conversation
	currentDeal: Deal
}
export const history = createBrowserHistory()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore() {
	const store = createStore(
		rootReducer(history),
		composeEnhancers(
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
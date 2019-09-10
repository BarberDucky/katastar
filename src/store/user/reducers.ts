import { UserActionTypes } from './interfaces'
import User from '../../models/user.model'
import { LOAD_USER } from './types'

const initialState: User = {
	address: '',
	firstName: '',
	lastName: '',
	location: '',
	parcels: [],
	auctions: [],
	conversations: [],
	inheritances: [],
	deals: []
}

export function userReducer(state = initialState, action: UserActionTypes): User {
	switch (action.type) {
		case LOAD_USER: {
			return action.payload
		}
		default: {
			return state
		}
	}
}
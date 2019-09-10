import { LOAD_USER } from './types'
import User from '../../models/user.model'

export interface LoadUserAction {
	type: typeof LOAD_USER,
	payload: User
}

export type UserActionTypes =
	LoadUserAction 
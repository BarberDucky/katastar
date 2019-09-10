import { Dispatch } from 'redux'
import { readUser } from '../services/user.service'
import { desiredNetwork } from '../config/keys'
import { push } from 'connected-react-router'
import { LOAD_USER } from '../store/user/types'
import { LoadUserAction } from '../store/user/interfaces'
import firebase from '../config/firebase'

export function loadUserAndRoute(currentRoute: string) {
	return async (dispatch: Dispatch) => {
		const userFromDB = await readUser(window.ethereum.selectedAddress)

		if (window.ethereum.networkVersion !== desiredNetwork) {
			dispatch(push('/wrong-network'))
			return
		}

		if (!userFromDB || !userFromDB.address) {
			dispatch(push('/register'))
		} else {
			const action: LoadUserAction = {
				type: LOAD_USER,
				payload: userFromDB
			}
			dispatch(action)

			firebase.database().ref(`users/${userFromDB.address}`).on('value',
				snapshot => {
					const action: LoadUserAction = {
						type: LOAD_USER,
						payload: snapshot.val()
					}
					dispatch(action)
				}
			)

			dispatch(push(currentRoute))
		}
	}
} 
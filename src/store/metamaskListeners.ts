import { AppState } from '.'
import { LOAD_USER } from './user/types'
import { readUser } from '../services/user.service'
import { push } from 'connected-react-router'
import { Dispatch } from 'redux'
import { desiredNetwork } from '../config/keys'
import firebase from '../config/firebase'
import { LoadUserAction } from './user/interfaces'

type StoreGetState = () => AppState

export default function (dispatch: Dispatch, getState: StoreGetState) {
	window.ethereum.on('accountsChanged', async (accounts: Array<string>) => {
		const previousUser = getState().user
		if (previousUser) {
			console.log('prev user', previousUser)
			firebase.database().ref(`users/${previousUser.address}`).off('value')
		}
		const userFromDB = await readUser(accounts[0])
		if (!userFromDB || !userFromDB.address) {
			if (window.ethereum.networkVersion !== desiredNetwork) {
				dispatch(push('/wrong-network'))
			} else {
				dispatch(push('/register'))
			}
		} else {
			firebase.database().ref(`users/${userFromDB.address}`).on('value',
				snapshot => {
					const action: LoadUserAction = {
						type: LOAD_USER,
						payload: snapshot.val()
					}
					dispatch(action)
				}
			)
			if (window.ethereum.networkVersion !== desiredNetwork) {
				dispatch(push('/wrong-network'))
			} else {
				dispatch(push('/'))
			}
		}
	})

	window.ethereum.on('networkChanged', async (newNetwork: string) => {
		const userFromDB = await readUser(window.ethereum.selectedAddress)
		if (newNetwork !== desiredNetwork) {
			dispatch(push('/wrong-network'))
		} else {
			if (!userFromDB || !userFromDB.address) {
				dispatch(push('/register'))
			} else {
				const previousUser = getState().user.address
				console.log('prev user', previousUser)
				firebase.database().ref(`users/${previousUser}`).off('value')
				firebase.database().ref(`users/${userFromDB.address}`).on('value',
				snapshot => {
					const action: LoadUserAction = {
						type: LOAD_USER,
						payload: snapshot.val()
					}
					dispatch(action)
				}
			)
				dispatch(push('/'))
			}
		}
	})
}
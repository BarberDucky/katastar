import firebase from '../config/firebase'
import User from '../models/user.model';
import { UserFormData } from '../components/ui/explorer/explorer-entities/user';


export const readUser = async (metamaskAddress: string) => {
	const userValue = await firebase.database().ref('users/' + metamaskAddress).once('value')
	const user: User = userValue.val()
	if (user) {
		user.parcels = user.parcels ? Object.values(user.parcels) : []
		user.auctions = user.auctions ? Object.values(user.auctions) : []
	}

	return user
}

export const createUser = async (user: User) => {
	const createRes = await firebase.database().ref('users/' + user.address).set(user)
	console.log(createRes)
}

export const updateUser = async (user: User) => {
	const updateRes = await firebase.database().ref('users/' + user.address).set(user)
	console.log(updateRes)
}

export const searchUsers = async (userFilter: UserFormData) => {
	const userValue = await firebase.database().ref('users/').once('value')
	const result = userValue.val()
	const users: User[] = result ? Object.values(result) : []

	return users
		.filter(user => {
			return user.address.indexOf(userFilter.address || '') !== -1 &&
				user.firstName.indexOf(userFilter.firstName || '') !== -1 &&
				user.lastName.indexOf(userFilter.lastName || '') !== -1 &&
				user.location.indexOf(userFilter.location || '') !== -1 
      })
}


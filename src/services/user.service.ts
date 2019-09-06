import firebase from '../config/firebase'
import User from '../models/user.model';
import { UserFormData } from '../components/ui/explorer/explorer-entities/user';

export const readUser = async (metamaskAddress: string) => {
	const userValue = await firebase.database().ref('users/' + metamaskAddress).once('value')
	const user: User = userValue.val()
	if (user) {
		user.parcels = user.parcels ? Object.values(user.parcels) : []
		user.auctions = user.auctions ? Object.values(user.auctions) : []
		user.inheritances = user.inheritances ? Object.values(user.inheritances) : []
		user.deals = user.deals ? Object.values(user.deals) : []
	}

	return user
}

export const createUser = async (user: User) => {
	const existingUserValue = await firebase.database().ref('users/' + user.address).once('value')
	let existingUser: User = existingUserValue.val()

	if (!existingUser) {
		await firebase.database().ref('users/' + user.address).set(user)
	} else {
		await updateUser(user)
	}
}

export const updateUser = async (user: User) => {
	const userValue = await firebase.database().ref('users/' + user.address).once('value')
	let currentUser: User = userValue.val()

	const {address, firstName, lastName, location} = user

	currentUser = {
		...currentUser,
		address,
		firstName,
		lastName,
		location,
	}

	await firebase.database().ref('users/' + user.address).set(currentUser)
}

export const searchUsers = async (userFilter: Partial<UserFormData>) => {
	const userValue = await firebase.database().ref('users/').once('value')
	const result = userValue.val()
	const users: User[] = result ? Object.values(result) : []

	return users
		.filter(user => user.address)
		.filter(user => {
			return user.address.indexOf(userFilter.address || '') !== -1 &&
				user.firstName.indexOf(userFilter.firstName || '') !== -1 &&
				user.lastName.indexOf(userFilter.lastName || '') !== -1 &&
				user.location.indexOf(userFilter.location || '') !== -1 
      })
}


import firebase from '../config/firebase'
import User from '../models/user.model';
import qs from 'qs'
import { UserFormData } from '../components/ui/explorer/explorer-entities/user';


export const readUser = async (metamaskAddress: string) => {
    const userValue = await firebase.database().ref('users/' + metamaskAddress).once('value')
    const user: User = userValue.val()
    if (!user.parcels)
        user.parcels = []
    return user
}

export const createUser = async (user: User) => {
    const createRes = await firebase.database().ref('users/' + user.address).set(user)
    console.log(createRes)
}

export const updateUser = async (user: User) => {
    const updateRes = await firebase.database().ref('users/' + user.address).set(user)
    console.log(user)
    console.log(updateRes)
}

export const getUsers = async (queryString: string) => {
    const userQuery = qs.parse(queryString) as UserFormData
    console.log(userQuery)
}
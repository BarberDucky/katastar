import firebase from '../config/firebase'
import User from '../models/user.model';


export const readUser = async (metamaskAddress: string) => {
    const userValue = await firebase.database().ref('users/' + metamaskAddress).once('value')
    const user: User = userValue.val()
    return user
}

export const createUser = async (user: User) => {
    const createRes = await firebase.database().ref('users/' + user.address).set(user)
    console.log(createRes)
}
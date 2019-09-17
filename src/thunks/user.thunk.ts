import firebase from '../config/firebase'
import { Dispatch } from 'redux'
import { LOAD_USER } from '../store/user/types'
import { LoadUserAction } from '../store/user/interfaces'

export const fetchUser = (userId: string, previousUserId: string) => async (dispatch: Dispatch) => {
  console.log('prev user', previousUserId)
  firebase.database().ref(`users/${previousUserId}`).off('value')
  firebase.database().ref(`users/${userId}`).on('value',
    snapshot => {
      const action: LoadUserAction = {
        type: LOAD_USER,
        payload: snapshot.val()
      }
      console.log(userId, snapshot.val())
      dispatch(action)
    }
  )
}
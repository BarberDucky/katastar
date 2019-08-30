import firebase from '../config/firebase'
import { Dispatch } from 'redux';
import { LOAD_USER } from '../store/user/types';
import { LoadUserAction } from '../store/user/interfaces';

export const fetchUser = (userId: string) => async (dispatch: Dispatch) => {
  firebase.database().ref(`users/${userId}`).on('value', 
    snapshot => {
      const user = snapshot.val()
      if (user) {
        user.parcels = user.parcels ? Object.values(user.parcels) : []
        user.auctions = user.auctions ? Object.values(user.auctions) : []
        user.inheritances = user.inheritances ? Object.values(user.inheritances) : []
        user.deals = user.deals ? Object.values(user.deals) : []
      }

      const action: LoadUserAction = {
        type: LOAD_USER,
        payload: user
      }

      console.log('payload', action.payload)
      dispatch(action)
    }
  )
}
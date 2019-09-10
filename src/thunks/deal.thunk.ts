import firebase from '../config/firebase'
import { Dispatch } from 'redux'
import Deal from '../models/deal.model'
import { LoadDealAction } from '../store/current-deal/interfaces'
import { LOAD_DEAL } from '../store/current-deal/types'

export const fetchDeal = (oldDealId: string, newDealId: string, userId: string) => async (dispatch: Dispatch) => {
  if (oldDealId) {
    await firebase.database().ref(`users/${userId}/deals/${oldDealId}`).off('value')
  }
  
  firebase.database().ref(`users/${userId}/deals/${newDealId}`).on('value', 
    snapshot => {
      const deal: Deal = snapshot.val()
      
      const action: LoadDealAction = {
        type: LOAD_DEAL,
        payload: deal
      }

      dispatch(action)
    }
  )
}
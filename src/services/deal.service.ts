import Deal from "../models/deal.model";
import  firebase from '../config/firebase'

export const createDeal = async (deal: Deal) => {
  //TODO push deal to blockchain
  deal.address = Date.now().toString()

  await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals`).push(deal)
  await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals`).push(deal)
}

export const withdrawDeal = async (deal: Deal) => {
  await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals/${deal.address}/withdrawn`).set(true)
  await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals/${deal.address}/withdrawn`).set(true)
}


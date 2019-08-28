import Auction from "../models/auction.model";
import firebase from '../config/firebase'

export const createAuction = async (auction: Auction) => {
  //TODO put auction on blockchain
  auction.address = Date.now().toString()
  const createRes = await firebase.database().ref('users/' + auction.owner + '/auctions/' + auction.address).set(auction)

  // remove parcel token from user
  await firebase.database().ref('users/' + auction.owner + '/parcels/' + auction.parcel).remove()
  console.log(createRes)
}
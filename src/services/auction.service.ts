import Auction from "../models/auction.model";
import firebase from '../config/firebase'
import { sleep } from "../helper";
import { AuctionFormData } from "../components/ui/explorer/explorer-entities/auction";
import AuctionFactory from "./contracts/auctionFactory"
import ParcelToken from "./contracts/parcelToken"
import Web3 from 'web3'
import { readParcel } from "./parcel.service";

export const createAuction = async (auction: Auction, parcelId: string, web3: Web3) => {
  const auctionFactory = AuctionFactory(web3)
  const parcelToken = ParcelToken(web3)
  
  const parcel = await readParcel(parcelId)
  
  const owner = auction.owner

  await parcelToken.methods.approve(auctionFactory.options.address, auction.parcel.address).send({from: owner})
  await auctionFactory.methods.createAuction(auction.parcel.address, auction.startingPrice, auction.duration).send({from: owner})

  const auctionId = await auctionFactory.methods.getAuctionByParcelId(auction.parcel).call()
  
  auction.parcel = parcel
  auction.address = auctionId

  await firebase.database().ref('users/' + owner + '/auctions/' + auction.address).set(auction)
  await firebase.database().ref(`auctions/${auction.address}`).set(auction)
  // remove parcel token from user
  await firebase.database().ref('users/' + auction.owner + '/parcels/' + auction.parcel.address).remove()
}

export const readAuction = async (auctionId: string) => {
  const auctionValue = await firebase.database().ref('auctions/' + auctionId).once('value')
  const auction: Auction = auctionValue.val()

  return auction
}

export const searchAuctions = async (auctionFilter: AuctionFormData) => {
  const auctionValue = await firebase.database().ref('auctions/').once('value')
  const result = auctionValue.val()
  const auctions: Auction[] = result ? Object.values(result) : []

  return auctions
    .filter(auction => {
      return auction.parcel.address.toString().indexOf(auctionFilter.address || '') !== -1 &&
        auction.owner.indexOf(auctionFilter.owner || '') !== -1 &&
        auction.parcel.region.indexOf(auctionFilter.region || '') !== -1 &&
        auction.parcel.municipality.indexOf(auctionFilter.municipality || '') !== -1 &&
        auction.parcel.cadastreMunicipality.indexOf(auctionFilter.cadastreMunicipality || '') !== -1
    })
}

export const submitBid = async (auctionId: string, bid: number) => {
  await sleep(500)
}
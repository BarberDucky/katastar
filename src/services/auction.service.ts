import Auction from "../models/auction.model";
import firebase from '../config/firebase'
import { sleep } from "../helper";
import { AuctionFormData } from "../components/ui/explorer/explorer-entities/auction";
import AuctionFactory from "./contracts/auctionFactory"
import ParcelToken from "./contracts/parcelToken"
import Web3 from 'web3'
import { readParcel } from "./parcel.service";
import AuctionContract from './contracts/auction'

export const createAuction = async (auction: Auction, parcelId: string, web3: Web3) => {
  const auctionFactory = AuctionFactory(web3)
  const parcelToken = ParcelToken(web3)

  const parcel = await readParcel(parcelId)
  auction.parcel = parcel

  const owner = auction.owner

  await parcelToken.methods.approve(auctionFactory.options.address, auction.parcel.address).send({ from: owner })
  await auctionFactory.methods.createAuction(auction.parcel.address, auction.startingPrice, auction.duration).send({ from: owner })

  const now = Date.now()
  const deadline = now + Number(auction.duration) * 1000

  const auctionId = await auctionFactory.methods.getAuctionByParcelId(auction.parcel.address).call()

  auction.deadline = deadline
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

export const readAuctionTime = async (auctionId: string, web3: Web3) => {
  const auctionContract = AuctionContract(web3, auctionId)
  const auctionDuration = await auctionContract.methods.returnDeadline().call()

  return auctionDuration
}

export const readHighestBid = async (auctionId: string, web3: Web3) => {
  const auctionContract = AuctionContract(web3, auctionId)
  const highestBid = await auctionContract.methods.getHighestBid().call()

  return highestBid
}

export const submitBid = async (auction: Auction, bid: number, userId: string, web3: Web3) => {
  if (auction.owner === userId) return false

  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  console.log(now, auction.deadline, auctionRemainingTime)
  if (auctionRemainingTime <= 0) return false
  const auctionContract = AuctionContract(web3, auction.address)

  const highestBid = await auctionContract.methods.getHighestBid().call()
  if (bid <= Number(highestBid)) return false

  try {
    await auctionContract.methods.bid().send({from: userId, value: bid})
    await firebase.database().ref(`users/${userId}/auctions/${auction.address}`).set(auction)
    
    return true
  
  } catch (error) {

    alert(error)
    return false
  }
}

export const withdrawBids = async (auction: Auction, userId: string, web3: Web3) => {
  if (auction.owner === userId) return false

  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  if (auctionRemainingTime > 0) return false

  const auctionContract = AuctionContract(web3, auction.address)
  try{ 
    await auctionContract.methods.withdrawBids().send({from: userId})

    return true

  } catch (error) {

    alert(error)
    return false
  }
}

export const withdrawParcel = async (auction: Auction, userId: string, web3: Web3) => {
  if (auction.owner === userId) return false

  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  if (auctionRemainingTime > 0) return false

  const auctionContract = AuctionContract(web3, auction.address)

  try{ 
    await auctionContract.methods.withdrawParcel().send({from: userId})
    await firebase.database().ref(`parcels/${auction.parcel.address}/owner`).set(userId)
    const parcel = await readParcel(auction.parcel.address)
    await firebase.database().ref(`users/${userId}/parcels/${parcel.address}`).set(parcel)

    return true 

  } catch (error) {
    alert(error)
    return false
  }
}

export const endAuction = async (auction: Auction, userId: string, web3: Web3) => {
  if (auction.owner !== userId) return false

  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  if (auctionRemainingTime > 0) return false

  const auctionContract = AuctionContract(web3, auction.address)
  const parcelToken = ParcelToken(web3)

  try{
    await auctionContract.methods.endAuction().send({from: userId})

    let newTokenOwner = await parcelToken.methods.ownerOf(auction.parcel.address).call()
    newTokenOwner = web3.utils.toChecksumAddress(newTokenOwner)
    const userIdChecksum = web3.utils.toChecksumAddress(userId)

    if (newTokenOwner === userIdChecksum) {
      const parcel = await readParcel(auction.parcel.address)
      await firebase.database().ref(`users/${userId}/parcels/${parcel.address}`).set(parcel)
    }

    return true
  }
  catch(error) {
    console.log(error.payload)
    return false
  }
}
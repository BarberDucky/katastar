import Auction from '../models/auction.model'
import firebase from '../config/firebase'
import { AuctionFormData } from '../components/ui/explorer/explorer-entities/auction'
import AuctionFactory from './contracts/auctionFactory'
import ParcelToken from './contracts/parcelToken'
import Web3 from 'web3'
import { readParcel } from './parcel.service'
import AuctionContract from './contracts/auction'

export const createAuction = async (auction: Auction, parcelId: string, web3: Web3) => {
  const auctionFactory = AuctionFactory(web3)
  const parcelToken = ParcelToken(web3)

  const parcel = await readParcel(parcelId)
  auction.parcel = parcel

  console.log(parcel, parcelId)
  const owner = auction.owner

  const now = Date.now()
  const duration = Math.floor((auction.deadline - now) / 1000)
  auction.duration = duration

  const weiStartingPrice = web3.utils.toWei(auction.startingPrice.toString())

  await parcelToken.methods.approve(auctionFactory.options.address, auction.parcel.address).send({ from: owner })
  await auctionFactory.methods.createAuction(auction.parcel.address, weiStartingPrice, auction.duration).send({ from: owner })

  const auctionId = await auctionFactory.methods.getAuctionByParcelId(auction.parcel.address).call()

  auction.address = auctionId

  await firebase.database().ref('users/' + owner + '/auctions/' + auction.address).set(auction)
  await firebase.database().ref(`auctions/${auction.address}`).set(auction)
  // remove parcel token from user
  await firebase.database().ref('users/' + auction.owner + '/parcels/' + auction.parcel.address).remove()
}

export const readAuction = async (auctionId: string) => {
  const auctionValue = await firebase.database().ref('auctions/' + auctionId).once('value')
  const auction: Auction | null = auctionValue.val()

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

  const ethHighestBid = await web3.utils.fromWei(highestBid)

  return ethHighestBid
}

export const readHighestBidder = async (auctionId: string, web3: Web3) => {
  const auctionContract = AuctionContract(web3, auctionId)
  const highestBidder = await auctionContract.methods.getHighestBidder().call()

  return highestBidder
}

export const submitBid = async (auction: Auction, bid: number, userId: string, web3: Web3) => {
  if (auction.owner === userId) {
    alert(`Owner can't bid`)
    return false
  } 

  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  
  if (auctionRemainingTime <= 0) {
    alert(`Auction is over`)
    return false
  }
  const auctionContract = AuctionContract(web3, auction.address)

  const highestBid = await auctionContract.methods.getHighestBid().call()
  const ethHighestBid = web3.utils.fromWei(highestBid)
  console.log(highestBid, bid, Number(ethHighestBid))
  if (bid <= Number(ethHighestBid)) {
    alert(`Bid too low`)
    return false
  }
  try {
    const weiValue = web3.utils.toWei(bid.toString())
    await auctionContract.methods.bid().send({from: userId, value: weiValue})
    await firebase.database().ref(`users/${userId}/auctions/${auction.address}`).set(auction)
    
    return true
  
  } catch (error) {

    alert(`Transaction unsuccessful`)
    return false
  }
}

export const withdrawBids = async (auction: Auction, userId: string, web3: Web3) => {
  if (auction.owner === userId) {
    alert(`Owner didn't bid`)
    return false
  }
  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  if (auctionRemainingTime > 0) {
    alert(`Auction isn't over`)
    return false
  }
  const auctionContract = AuctionContract(web3, auction.address)
  try{ 
    await auctionContract.methods.withdrawBids().send({from: userId})

    return true

  } catch (error) {

    alert(`Transaction unsuccessful`)
    return false
  }
}

export const withdrawParcel = async (auction: Auction, userId: string, web3: Web3) => {
  if (auction.owner === userId) {
    alert(`Owner didn't bid`)
    return false
  }

  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  if (auctionRemainingTime > 0) {
    alert(`Auction isn't over`)
    return false
  }

  const auctionContract = AuctionContract(web3, auction.address)

  try{ 
    const highestBidder = await readHighestBidder(auction.address, web3)
    console.log(highestBidder)
    const userAddress = web3.utils.toChecksumAddress(userId)
    if (userAddress !== highestBidder) {
      alert(`Current user didn't win`)
      return false
    }
    const isWithdrawn = await auctionContract.methods.getIsWithdrawnWinner().call()
    if (isWithdrawn) {
      alert(`Parcel already withdrawn`)
      return false
    }
    await auctionContract.methods.withdrawParcel().send({from: userId})
    await firebase.database().ref(`parcels/${auction.parcel.address}/owner`).set(userId)
    const parcel = await readParcel(auction.parcel.address)
    await firebase.database().ref(`users/${userId}/parcels/${parcel.address}`).set(parcel)

    return true 

  } catch (error) {
    alert(`Transaction unsuccessful`)
    return false
  }
}

export const endAuction = async (auction: Auction, userId: string, web3: Web3) => {
  if (auction.owner !== userId) {
    alert(`Only owner can end auction`)
    return false
  }
  const now = Date.now()
  const auctionRemainingTime = auction.deadline - now

  if (auctionRemainingTime > 0) {
    alert(`Auction isn't over`)
    return false
  }

  const auctionContract = AuctionContract(web3, auction.address)
  const parcelToken = ParcelToken(web3)

  try{
    const isWithdrawn = await auctionContract.methods.getIsWithdrawnOwner().call()
    if (isWithdrawn) {
      alert('Auction owner already withdrew')
      return false
    }

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
    alert(`Transaction unsuccessful`)
    return false
  }
}
import Deal, { Asset } from '../models/deal.model'
import firebase from '../config/firebase'
import Web3 from 'web3'
import DealContract from './contracts/deal'
import ParcelToken from './contracts/parcelToken'
import DealAbi from '../truffle/build/contracts/Deal.json'
import Contract from 'web3/eth/contract'
import { readParcel } from './parcel.service'

export const createDeal = async (deal: Deal) => {
  deal.id = Date.now().toString()

  await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals/${deal.id}`).set(deal)
  await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals/${deal.id}`).set(deal)

  return deal.id
}

export const readDeal = async (dealId: string, userId: string) => {
  const dealRes = await firebase.database().ref(`users/${userId}/deals/${dealId}`).once('value')
  const deal: Deal = dealRes.val()

  return deal
}

export const updateDeal = async (deal: Deal) => {
  await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals/${deal.id}`).set(deal)
  await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals/${deal.id}`).set(deal)
}

export const putDealOnChain = async (deal: Deal, web3: Web3, currentUser: string) => {

  const dealContract = DealContract(web3)
  const parcelToken = ParcelToken(web3)


  const res = await dealContract.deploy({
    data: DealAbi.bytecode,
    arguments: [
      parcelToken.options.address,
      deal.user1Asset.userAddress, deal.user2Asset.userAddress,
      deal.user1Asset.eth, deal.user2Asset.eth,
      deal.user1Asset.parcels, deal.user2Asset.parcels
    ]
  }).send({from: currentUser})


  const address = res.options.address

  deal.address = address
  deal.isConfirmed = true

  await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals/${deal.id}`).set(deal)
  await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals/${deal.id}`).set(deal)
}

export const payDeal = async (deal: Deal, userId: string, web3: Web3) => {
  const dealContract = DealContract(web3, deal.address)
  const parcelToken = ParcelToken(web3)

  let isSettled = await dealContract.methods.isSettled().call()
  if (isSettled) return false

  const assetsForPayment: Asset = userId === deal.user1Asset.userAddress ? deal.user1Asset : deal.user2Asset 
  const payingUser: string = userId === deal.user1Asset.userAddress ? 'user1Asset' : 'user2Asset'

  const {parcels, eth} = assetsForPayment
  
  try {
    if (eth > 0)
      await dealContract.methods.payEth().send({from: userId, value: eth})
  } catch (error) {
    alert(error)
    return false
  }
  
  try { 
    if (parcels !== '') {
      await parcelToken.methods.safeTransferFrom(userId, deal.address, parcels).send({from: userId})
      await firebase.database().ref(`users/${userId}/parcels/${parcels}`).remove()
    }
  } catch (error) {
    alert(error)
    return false
  }
  
  await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals/${deal.id}/${payingUser}/isPayed`).set(true)
  await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals/${deal.id}/${payingUser}/isPayed`).set(true)

  isSettled = await dealContract.methods.isSettled().call()
  if (isSettled) {
    await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals/${deal.id}/isCompleted`).set(true)
    await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals/${deal.id}/isCompleted`).set(true)  
  }

  return true
}

export const withdrawDeal = async (deal: Deal, userId: string, web3: Web3) => {
  const dealContract = DealContract(web3, deal.address)

  const isSettled = await dealContract.methods.isSettled().call()
  
  if (isSettled) {
    await withdrawReceived(deal, userId, web3, dealContract)
  } else {
    await withdrawPayed(deal, userId, web3, dealContract)
  }
}

const withdrawPayed = async (deal: Deal, userId: string, web3: Web3, dealContract: Contract) => {
  const assetsForPayment: Asset = userId === deal.user1Asset.userAddress ? deal.user1Asset : deal.user2Asset 
  const payingUser: string = userId === deal.user1Asset.userAddress ? 'user1Asset' : 'user2Asset'

  if (!assetsForPayment.isPayed) return false

  try {

    await dealContract.methods.withdraw().send({from: userId})

    if (assetsForPayment.parcels !== '') {
      const parcel = await readParcel(assetsForPayment.parcels)
      await firebase.database().ref(`users/${userId}/parcels/${parcel.address}`).set(parcel)

      assetsForPayment.isPayed = false
      await firebase.database().ref(`users/${deal.user1Asset.userAddress}/deals/${deal.id}/${payingUser}/isPayed`).set(false)
      await firebase.database().ref(`users/${deal.user2Asset.userAddress}/deals/${deal.id}/${payingUser}/isPayed`).set(false)

    }

  } catch (error) {
    alert(error)
    return false
  }

}

const withdrawReceived = async (deal: Deal, userId: string, web3: Web3, dealContract: Contract) => {
  const assetsToReceive: Asset = userId === deal.user1Asset.userAddress ? deal.user2Asset : deal.user1Asset

  try {

    await dealContract.methods.withdraw().send({from: userId})

    if (assetsToReceive.parcels !== '') {
      await firebase.database().ref(`parcels/${assetsToReceive.parcels}/owner`).set(userId)
      const parcel = await readParcel(assetsToReceive.parcels)
      await firebase.database().ref(`users/${userId}/parcels/${parcel.address}`).set(parcel)
    }

  } catch (error) {
    alert(error)
    return false
  }
}

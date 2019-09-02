import firebase from '../config/firebase'
import Parcel from '../models/parcel.model';
import { ParcelFormData } from '../components/ui/explorer/explorer-entities/parcel';
import Web3 from 'web3'
import ParcelTokenContract from './contracts/parcelToken'
import parcels from '../models/sampleParcels';

export const readParcel = async (parcelId: string) => {
  const parcelValue = await firebase.database().ref('parcels/' + parcelId).once('value')
  const parcel: Parcel = parcelValue.val()

  return parcel
}

export const readParcelsFromChain = async (web3: Web3) => {
  const parcelToken = ParcelTokenContract(web3)
  const tokenNumber = await parcelToken.methods.getTokenIds().call()
  
  return tokenNumber
}

export const searchParcels = async (parcelFilter: ParcelFormData) => {
  const parcelValue = await firebase.database().ref('parcels/').once('value')
  const result = parcelValue.val()
  const parcels: Parcel[] = result ? Object.values(result) : []

  return parcels
    .filter(parcel => {
      return parcel.address.toString().indexOf(parcelFilter.address || '') !== -1 &&
        parcel.owner.indexOf(parcelFilter.owner || '') !== -1 &&
        parcel.region.indexOf(parcelFilter.region || '') !== -1 &&
        parcel.municipality.indexOf(parcelFilter.municipality || '') !== -1 &&
        parcel.cadastreMunicipality.indexOf(parcelFilter.cadastreMunicipality || '') !== -1
    })
}

export const createParcel = async (parcel: Parcel, web3: Web3, userId: string, adminUser: string) => {
  const parcelToken = ParcelTokenContract(web3)
  await parcelToken.methods.mintToken(userId).send({from: adminUser})
  
  const tokenNumber = await parcelToken.methods.getTokenIds().call()
  let tokenIndex = await parcelToken.methods.balanceOf(userId).call()
  tokenIndex--
  const tokenId = await parcelToken.methods.tokenOfOwnerByIndex(userId, tokenIndex).call()
  const owner = await parcelToken.methods.ownerOf(tokenId).call()

  parcel.address = tokenId
  parcel.owner = userId

  await firebase.database().ref(`parcels/${tokenId}`).set(parcel)
  await firebase.database().ref(`users/${userId}/parcels/${tokenId}`).set(parcel)
}

export const burnAllTokens = async (web3: Web3, adminUser: string) => {
  const parcelToken = ParcelTokenContract(web3)
  let totalSupply = await parcelToken.methods.totalSupply().call()

  while (totalSupply > 0) {
    const tokenId = await parcelToken.methods.tokenByIndex(totalSupply - 1).call()
    await parcelToken.methods.burnToken(tokenId).send({from: adminUser})
    totalSupply--
  }

  totalSupply = await parcelToken.methods.totalSupply().call()

  await firebase.database().ref(`parcels`).set(null)
}

export const generateParcels = async (web3: Web3, adminUser: string) => {
  Promise.all(
    parcels.map(parcel => {
      return createParcel(parcel, web3, parcel.owner, adminUser) 
    })
  )
}
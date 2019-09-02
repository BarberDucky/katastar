import  firebase from '../config/firebase'
import Inheritance from '../models/inheritance.model';
import InheritanceFactory from './contracts/inheritanceFactory'
import ParcelToken from './contracts/parcelToken'
import Web3 from 'web3'

export const createInheritance = async (inheritance: Inheritance, web3: Web3) => {
  const inheritanceFactory = InheritanceFactory(web3)
  const parcelToken = ParcelToken(web3)
  
  const owner = inheritance.from

  //await parcelToken.methods.approve(inheritanceFactory.options.address, inheritance.parcel).send({from: owner})
  await inheritanceFactory.methods.createInheritance(inheritance.parcel, inheritance.to, inheritance.duration).send({from: owner})

  const auctionId = await inheritanceFactory.methods.getInheritanceByParcelId(inheritance.parcel).call()
  
  inheritance.address = auctionId

  await firebase.database().ref(`users/${inheritance.from}/inheritances/${inheritance.address}`).set(inheritance)
  await firebase.database().ref(`users/${inheritance.to}/inheritances/${inheritance.address}`).set(inheritance)

  await firebase.database().ref('users/' + inheritance.from + '/parcels/' + inheritance.parcel).remove()
}

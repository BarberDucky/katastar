import  firebase from '../config/firebase'
import Inheritance from '../models/inheritance.model'
import InheritanceFactory from './contracts/inheritanceFactory'
import ParcelToken from './contracts/parcelToken'
import InheritanceContract from './contracts/inheritance'
import Web3 from 'web3'
import { readParcel } from './parcel.service'

export const createInheritance = async (inheritance: Inheritance, web3: Web3) => {
  const inheritanceFactory = InheritanceFactory(web3)
  const parcelToken = ParcelToken(web3)
  
  const owner = inheritance.from
  try {

    const now = Date.now()
    const duration = Math.floor((inheritance.deadline - now) / 1000)
    inheritance.duration = duration

    await parcelToken.methods.approve(inheritanceFactory.options.address, inheritance.parcel).send({from: owner})
    await inheritanceFactory.methods.createInheritance(inheritance.parcel, inheritance.to, inheritance.duration).send({from: owner})

    const inheritanceId = await inheritanceFactory.methods.getInheritanceByParcelId(inheritance.parcel).call()
    
    inheritance.address = inheritanceId

    await firebase.database().ref(`users/${inheritance.from}/inheritances/${inheritance.address}`).set(inheritance)
    await firebase.database().ref(`users/${inheritance.to}/inheritances/${inheritance.address}`).set(inheritance)

    await firebase.database().ref('users/' + inheritance.from + '/parcels/' + inheritance.parcel).remove()

    return true

  } catch (error) {
    alert(`Transaction unsuccessful`)
    return false
  }
}

export const readInheritance = async (inheritanceId: string, userId:string) => {
  const inheritanceValue = await firebase.database().ref(`users/${userId}/inheritances/${inheritanceId}`).once('value')
  const inheritance: Inheritance | null = inheritanceValue.val()

  return inheritance
}

export const readInheritanceTime = async (inheritanceId: string, web3: Web3) => {
  const inheritance = InheritanceContract(web3, inheritanceId)
  const inheritanceDuration = await inheritance.methods.getDeadline().call()

  return inheritanceDuration
}

export const withdraw = async (inheritance: Inheritance, web3: Web3, userId: string) => {
  const inheritanceContract = InheritanceContract(web3, inheritance.address)
  if (inheritance.isWithdrawn) {
    alert(`Inheritance already withdrawn`)
    return false
  }
  const now = Date.now()
  const remainingTime = inheritance.deadline - now
  
  if (
    (remainingTime > 0 && userId !== inheritance.from) ||
    (remainingTime <= 0 && userId !== inheritance.to) 
    ) 
  {
    alert(`Unable to withdraw at the current time`)
    return false
  }

  try {
    await inheritanceContract.methods.withdraw().send({from: userId})

    await firebase.database().ref(`users/${inheritance.from}/inheritances/${inheritance.address}/isWithdrawn`).set(true)
    await firebase.database().ref(`users/${inheritance.to}/inheritances/${inheritance.address}/isWithdrawn`).set(true)
  
    const parcel = await readParcel(inheritance.parcel)
    parcel.owner = userId
  
    await firebase.database().ref(`parcels/${parcel.address}/owner`).set(userId)
    await firebase.database().ref(`users/${userId}/parcels/${parcel.address}`).set(parcel)
  
    return true
  } catch (error) {
    alert(`Transaction unsuccessful`)
    return false
  }
}

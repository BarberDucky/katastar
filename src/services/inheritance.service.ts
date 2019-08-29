import  firebase from '../config/firebase'
import Inheritance from '../models/inheritance.model';

export const createInheritance = async (inheritance: Inheritance) => {
  //TODO put inheritance to blockchain
  inheritance.address = Date.now().toString()

  await firebase.database().ref(`users/${inheritance.from}/inheritances`).push(inheritance)
  await firebase.database().ref(`users/${inheritance.to}/inheritances`).push(inheritance)
}

import * as firebase from 'firebase/app'
import 'firebase/database'
import { firebaseConfig } from './keys'

export default firebase.initializeApp(firebaseConfig)
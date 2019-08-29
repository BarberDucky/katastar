import firebase from '../config/firebase'
import Parcel from '../models/parcel.model';
import { ParcelFormData } from '../components/ui/explorer/explorer-entities/parcel';

export const readParcel = async (parcelId: string) => {
  const parcelValue = await firebase.database().ref('parcels/' + parcelId).once('value')
  const parcel: Parcel = parcelValue.val()

  return parcel
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
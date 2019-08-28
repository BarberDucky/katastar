import Parcel from "./parcel.model";

export default interface User {
    address: string
    firstName: string
    lastName: string
    location: string
    parcels: Parcel[]
}
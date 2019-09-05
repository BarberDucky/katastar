import Parcel from "./parcel.model";

export default interface Auction {
    address: string
    owner: string
    parcel: Parcel
    startingPrice: number
    isDone: boolean
    duration: number
    deadline: number
}
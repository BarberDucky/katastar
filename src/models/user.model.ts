import Parcel from "./parcel.model";
import Auction from "./auction.model";

export default interface User {
    address: string
    firstName: string
    lastName: string
    location: string
    parcels: Parcel[]
    auctions: Auction[]
}
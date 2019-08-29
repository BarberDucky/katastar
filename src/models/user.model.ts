import Parcel from "./parcel.model";
import Auction from "./auction.model";

export interface ConversationInfo {
    isRead: boolean
    fromId: string
    fromName: string
    conversationId: string
}

export default interface User {
    address: string
    firstName: string
    lastName: string
    location: string
    parcels: Parcel[]
    auctions: Auction[]
    conversations: ConversationInfo[]
}
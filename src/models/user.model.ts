import Parcel from './parcel.model'
import Auction from './auction.model'
import Inheritance from './inheritance.model'
import Deal from './deal.model'

export interface ConversationInfo {
	isRead: boolean
	fromId: string
	fromName: string
	conversationId: string
	date: number
}

export default interface User {
	address: string
	firstName: string
	lastName: string
	location: string
	parcels: Parcel[]
	auctions: Auction[]
	conversations: ConversationInfo[]
	inheritances: Inheritance[]
	deals: Deal[]
}
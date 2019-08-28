export default interface Auction {
    address: string
    owner: string
    parcel: string
    startingPrice: number
    isDone: boolean
    deadline: string
}
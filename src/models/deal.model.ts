export interface Asset {
  userAddress: string
  eth: number
  parcels: string[]
  isConfirmed: boolean
  isPayed: boolean
}

export default interface Deal {
  address: string
  isWithdrawn: boolean
  isConfirmed: boolean
  isCompleted: boolean
  user1Asset: Asset
  user2Asset: Asset
}
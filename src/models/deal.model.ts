export interface Asset {
  userAddress: string
  eth: number
  parcels: string
  isConfirmed: boolean
  isPayed: boolean
  isWithdrawn: boolean
}

export default interface Deal {
  id: string
  address: string
  isWithdrawn: boolean
  isConfirmed: boolean
  isCompleted: boolean
  user1Asset: Asset
  user2Asset: Asset
}
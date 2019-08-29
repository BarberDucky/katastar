
export interface Asset {
  userAddress: string
  eth: number
  parcels: string[]
  isConfirmed: boolean
}

export default interface Deal {
  address: string
  isWithdrawn: boolean
  isConfirmed: boolean
  user1Asset: Asset
  user2Asset: Asset
}
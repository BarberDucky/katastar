
export interface Asset {
  userAddress: string
  eth: number
  parcels: string[]
}

export default interface Deal {
  address: string
  withdrawn: boolean
  user1Asset: Asset
  user2Asset: Asset
}
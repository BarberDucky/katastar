import Web3 from 'web3'
import Auction from '../../truffle/build/contracts/Auction.json'


export default (web3: Web3, address: string) => {
  return new web3.eth.Contract(
    Auction.abi,
    address
  )
}


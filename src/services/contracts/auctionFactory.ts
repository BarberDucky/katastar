import Web3 from 'web3'
import AuctionFactory from '../../truffle/build/contracts/AuctionFactory.json'
import {desiredNetwork} from '../../config/keys'


export default (web3: Web3) => {
  return new web3.eth.Contract(
    AuctionFactory.abi,
    AuctionFactory.networks[desiredNetwork].address
  )
}


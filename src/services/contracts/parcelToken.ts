import Web3 from 'web3'
import ParcelToken from '../../truffle/build/contracts/ParcelToken.json'
import { desiredNetwork } from '../../config/keys'



export default (web3: Web3) => {
  return new web3.eth.Contract(
    ParcelToken.abi,
    ParcelToken.networks[desiredNetwork].address
  )
}


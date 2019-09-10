import Web3 from 'web3'
import DealABI from '../../truffle/build/contracts/Deal.json'


export default (web3: Web3, address?: string) => {
  if (address) {
    return new web3.eth.Contract(
      DealABI.abi,
      address
    )
  } else {
    return new web3.eth.Contract(
      DealABI.abi
    ) 
  }
}


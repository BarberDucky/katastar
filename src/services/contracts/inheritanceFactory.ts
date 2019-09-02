import Web3 from "web3";
import InheritanceFactory from "../../truffle/build/contracts/InheritanceFactory.json"
import {desiredNetwork} from "../../config/keys"


export default (web3: Web3) => {
  return new web3.eth.Contract(
    InheritanceFactory.abi,
    InheritanceFactory.networks[desiredNetwork].address
  )
}


import Web3 from "web3";
import Inheritance from "../../truffle/build/contracts/Inheritance.json"


export default (web3: Web3, address: string) => {
  return new web3.eth.Contract(
    Inheritance.abi,
    address,
  )
}


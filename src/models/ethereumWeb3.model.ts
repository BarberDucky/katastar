import Web3 from 'web3'

export default interface EthereumWeb3 {
	ethereum: any,
	web3: Web3 | null
}
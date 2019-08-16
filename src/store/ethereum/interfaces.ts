import { LOAD_ETHEREUM_PROVIDER, LOAD_WEB3 } from "./types";
import Web3 from "web3";

export interface LoadEthereumProviderAction {
    type: typeof LOAD_ETHEREUM_PROVIDER,
    payload: any
}

export interface LoadWeb3Action {
    type: typeof LOAD_WEB3,
    payload: Web3
}

export type EthereumActionTypes =
    LoadEthereumProviderAction |
    LoadWeb3Action
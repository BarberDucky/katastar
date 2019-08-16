import { LoadEthereumProviderAction, LoadWeb3Action } from "./interfaces";
import { LOAD_ETHEREUM_PROVIDER, LOAD_WEB3 } from "./types";
import Web3 from "web3";

export function loadEthereumProvider(ethereumProvider: any): LoadEthereumProviderAction {
    return {
        type: LOAD_ETHEREUM_PROVIDER,
        payload: ethereumProvider
    }
}

export function loadWeb3(web3Instance: Web3): LoadWeb3Action {
    return {
        type: LOAD_WEB3,
        payload: web3Instance
    }
}
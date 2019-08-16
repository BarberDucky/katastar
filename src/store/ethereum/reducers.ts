import { EthereumActionTypes } from "./interfaces";
import { LOAD_ETHEREUM_PROVIDER, LOAD_WEB3 } from "./types";
import EthereumWeb3 from "../../models/ethereumWeb3.model";

const initialState: EthereumWeb3 = {
    ethereum: null,
    web3: null
}

export function ethereumReducer(state = initialState, action: EthereumActionTypes): EthereumWeb3 {
    switch (action.type) {
        case LOAD_ETHEREUM_PROVIDER: {
            return {
                ethereum: action.payload,
                web3: state.web3
            }
        }
        case LOAD_WEB3: {
            return {
                ethereum: state.ethereum,
                web3: action.payload
            }
        }
        default: {
            return state
        }
    }
}
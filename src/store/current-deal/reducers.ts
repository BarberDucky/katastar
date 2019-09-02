import Deal from "../../models/deal.model";
import { DealActionTypes } from "./interfaces";
import { LOAD_DEAL } from "./types";

const initialState: Deal = {
    id: '',
    address: '',
    isWithdrawn: false,
    isConfirmed: false,
    isCompleted: false,
    user1Asset: {
        userAddress: '',
        eth: 0,
        parcels: '',
        isConfirmed: false,
        isPayed: false
    },
    user2Asset: {
        userAddress: '',
        eth: 0,
        parcels: '',
        isConfirmed: false,
        isPayed: false
    },
}

export function dealReducer(state = initialState, action: DealActionTypes): Deal {
    switch (action.type) {
        case LOAD_DEAL: {
            
            return action.payload
        }
        default: {
            return state
        }
    }
}
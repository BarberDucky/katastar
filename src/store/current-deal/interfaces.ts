import { LOAD_DEAL } from "./types";
import Deal from "../../models/deal.model";

export interface LoadDealAction {
    type: typeof LOAD_DEAL,
    payload: Deal
}

export type DealActionTypes = 
    LoadDealAction 
import { AppState } from ".";
import { LOAD_USER } from "./user/types";
import { readUser } from "../services/user.service";
import { push } from "connected-react-router";
import { Dispatch } from "redux";
import { desiredNetwork } from "../config/keys";

type StoreGetState = () => AppState

export default function (dispatch: Dispatch, getState: StoreGetState ) {
    window.ethereum.on('accountsChanged', async (accounts: Array<string>) => {
        const userFromDB = await readUser(accounts[0])
        if (!userFromDB) {
            if (window.ethereum.networkVersion !== desiredNetwork) {
                dispatch(push('/wrong-network'))
            } else {
                dispatch(push('/register'))
            }
        } else {
            if (window.ethereum.networkVersion !== desiredNetwork) {
                dispatch(push('/wrong-network'))
            } else {
                dispatch(push('/'))
            }
            dispatch({
                type: LOAD_USER,
                payload: userFromDB
            })
        }
    })

    window.ethereum.on('networkChanged', async (newNetwork: string) => {
        const userFromDB = await readUser(window.ethereum.selectedAddress)
        console.log('uslo')
        if (newNetwork !== desiredNetwork) {
            dispatch(push('/wrong-network'))
        } else {
            if (!userFromDB) {
                dispatch(push('/register'))
            } else {
                dispatch({
                    type: LOAD_USER,
                    payload: userFromDB
                })
                dispatch(push('/'))
            }
        }
    })
}
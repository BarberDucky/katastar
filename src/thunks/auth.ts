import { Dispatch } from "redux";
import { readUser } from "../services/user.service";
import { desiredNetwork } from "../config/keys";
import { push } from "connected-react-router";
import { loadUser } from "../store/user/actions";

export function loadUserAndRoute(currentRoute: string) {
    return async (dispatch: Dispatch) => {
		const userFromDB = await readUser(window.ethereum.selectedAddress)
		
		if (window.ethereum.networkVersion !== desiredNetwork) {
			dispatch(push('/wrong-network'))
			return
		}

		if (!userFromDB) {
			dispatch(push('/register'))
		} else {
			dispatch(loadUser(userFromDB))
			dispatch(push(currentRoute))
		}
    }
} 
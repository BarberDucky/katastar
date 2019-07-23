import User from "../../models/user.model";
import { LoadUserAction } from "./interfaces";
import { LOAD_USER } from "./types";

export function loadUser(user: User) : LoadUserAction {
    return {
        type: LOAD_USER,
        payload: user
    }
}
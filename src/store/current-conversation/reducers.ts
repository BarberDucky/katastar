import Conversation from "../../models/conversation.model";
import { ConversationActionTypes } from "./interfaces";
import { LOAD_CONVERSATION } from "./types";


const initialState: Conversation = {
    user1: '',
    user2: '',
    messages: [],
    address: '',
}

export function conversatinReducer(state = initialState, action: ConversationActionTypes): Conversation {
    switch (action.type) {
        case LOAD_CONVERSATION: {
            console.log('conversation payload', action.payload)
            return action.payload
        }
        default: {
            return state
        }
    }
}
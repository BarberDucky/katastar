import { LOAD_CONVERSATION } from './types'
import Conversation from '../../models/conversation.model'

export interface LoadConversationAction {
	type: typeof LOAD_CONVERSATION,
	payload: Conversation
}

export type ConversationActionTypes =
	LoadConversationAction 
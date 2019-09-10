import { LoadConversationAction } from './interfaces'
import Conversation from '../../models/conversation.model'
import { LOAD_CONVERSATION } from './types'


export function loadConversationAction(conversation: Conversation): LoadConversationAction {
	return {
		type: LOAD_CONVERSATION,
		payload: conversation
	}
}
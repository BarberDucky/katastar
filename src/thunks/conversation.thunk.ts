import firebase from '../config/firebase'
import { Dispatch } from 'redux';
import Conversation from '../models/conversation.model';
import { LoadConversationAction } from '../store/current-conversation/interfaces';
import { LOAD_CONVERSATION } from '../store/current-conversation/types';
import { readConversationFromId } from '../services/conversation.service';

export const unsubscribeConversation = async (conversationId: string) => {
  await firebase.database().ref(`conversations/${conversationId}`).off('value') 
}

export const fetchConversation = (oldConversationId: string, targetUser: string, currentUserAddress: string) => async (dispatch: Dispatch) => {
  if (oldConversationId) {
    unsubscribeConversation(oldConversationId)
  }

  const conversation = await readConversationFromId(
    currentUserAddress,
    targetUser,
  )

  if (!conversation) return

  conversation.messages = conversation.messages ? Object.values(conversation.messages) : []
  const action: LoadConversationAction = {
    type: LOAD_CONVERSATION,
    payload: conversation,
  }
  dispatch(action)

  firebase.database().ref(`conversations/${conversation.address}`).on('value', 
    async snapshot => {
      const conversation: Conversation = snapshot.val()
      conversation.messages = conversation.messages ? Object.values(conversation.messages) : []

      //await readConversation(currentUserAddress, targetUser)

      await firebase.database().ref(`users/${currentUserAddress}/conversations/${targetUser}/isRead`).set(true)
      const action: LoadConversationAction = {
        type: LOAD_CONVERSATION,
        payload: conversation
      }

      dispatch(action)
    }
  )
}
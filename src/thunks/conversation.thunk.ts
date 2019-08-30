import firebase from '../config/firebase'
import { Dispatch } from 'redux';
import Conversation from '../models/conversation.model';
import { LoadConversationAction } from '../store/current-conversation/interfaces';
import { LOAD_CONVERSATION } from '../store/current-conversation/types';

export const fetchConversation = (oldConversationId: string, newConversationId: string) => async (dispatch: Dispatch) => {
  if (oldConversationId) {
    await firebase.database().ref(`conversations/${oldConversationId}`).off('value')
  }
  
  firebase.database().ref(`conversations/${newConversationId}`).on('value', 
    snapshot => {
      const conversation: Conversation = snapshot.val()
      conversation.messages = conversation.messages ? Object.values(conversation.messages) : []

      const action: LoadConversationAction = {
        type: LOAD_CONVERSATION,
        payload: conversation
      }

      dispatch(action)
    }
  )
}
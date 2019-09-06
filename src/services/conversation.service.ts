import firebase from '../config/firebase'
import Conversation, { Message } from "../models/conversation.model";
import User, { ConversationInfo } from "../models/user.model";

export const createConversation = async (message: Message) => {

  const conversation: Conversation = {
    user1: message.fromUser,
    user2: message.toUser,
    messages: [message],
    address: ''
  }

  const createRes = await firebase.database().ref(`conversations/`).push(conversation)
  
  const conversationId = createRes.key
  await firebase.database().ref(`conversations/${conversationId}/address`).set(conversationId)

  // add conversation info to users

  const fromUserRes = await firebase.database().ref(`users/${message.fromUser}`).once('value')
  const fromUser: User = fromUserRes.val()
  const fromUserName = fromUser.firstName + ' ' + fromUser.lastName

  const toUserRes = await firebase.database().ref(`users/${message.toUser}`).once('value')
  const toUser: User = toUserRes.val()
  const toUserName = toUser.firstName + ' ' + toUser.lastName

  
  if (!conversationId) {
    alert('error creating conversation')
    return
  }

  const now = Date.now()

  const toConversationInfo: ConversationInfo = {
    isRead: false,
    fromId: message.fromUser,
    fromName: fromUserName,
    conversationId,
    date: now,
  }

  const fromConversationInfo: ConversationInfo = {
    isRead: true,
    fromId: message.toUser,
    fromName: toUserName,
    conversationId,
    date: now,
  }

  await firebase.database().ref(`users/${message.fromUser}/conversations/${message.toUser}`).set(fromConversationInfo)
  await firebase.database().ref(`users/${message.toUser}/conversations/${message.fromUser}`).set(toConversationInfo)
}

export const readConversation = async (readingUserId: string, targetUserId: string) => {
  const conversationInfoValue = await firebase.database().ref(`users/${readingUserId}/conversations/${targetUserId}`).once('value')
  const conversationInfo: ConversationInfo = conversationInfoValue.val()

  if (conversationInfo) {
    await firebase.database().ref(`users/${readingUserId}/conversations/${targetUserId}/isRead`).set(true)

    return conversationInfo
  } else {
    return null
  }
}

export const readConversationFromId = async (currentUser: string, targetUser: string) => {
  const conversationInfoValue = await firebase.database().ref(`users/${currentUser}/conversations/${targetUser}`).once('value')
  const conversationInfo: ConversationInfo = conversationInfoValue.val()

  if (conversationInfo) {
    const {conversationId} = conversationInfo

    const conversationValue = await firebase.database().ref(`conversations/${conversationId}`).once('value')
    const conversation: Conversation = conversationValue.val()

    await firebase.database().ref(`users/${currentUser}/conversations/${targetUser}/isRead`).set(true)

    return conversation
  } else {
    return null
  }
  
}

export const pushMessage = async (message: Message, conversationId: string) => {
  const now = Date.now() 

  await firebase.database().ref(`users/${message.toUser}/conversations/${message.fromUser}/date`).set(now)
  await firebase.database().ref(`users/${message.fromUser}/conversations/${message.toUser}/date`).set(now)
  await firebase.database().ref(`users/${message.toUser}/conversations/${message.fromUser}/isRead`).set(false)
  await firebase.database().ref(`conversations/${conversationId}/messages`).push(message)
}
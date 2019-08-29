export interface Message {
  fromUser: string
  toUser: string
  content: string
}

export default interface Conversation {
  user1: string
  user2: string
  messages: Message[]
}
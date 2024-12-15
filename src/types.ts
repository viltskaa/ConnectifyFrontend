export type UserType = {
    id: number;
    username: string;
    jwt: string;
    online: boolean;
    lastSeen?: number;
}

export type MessageCodeType = "ENTER" | "LEAVE" | "INVITE" | "COMMON" | null

export type MessageType = {
    id: number
    text: string
    timestamp: number
    author: UserType
    chatId: number,
    replyTo: MessageType
    type: MessageCodeType
}

export type ChatType = {
    id: number
    chatName: string
    color: string
    icon: string
    users: UserType[]
    owner: UserType
    lastMessage: MessageType
}

export type ChatCreateType = {
    name: string
    color: string
    icon: string
    users: number[]
}

export type ContactRequestType = {
    id: number
    fromUser: UserType
    toUser: UserType
    approved: boolean
    cancelled: boolean
}

export type ContactType = {
    id: number
    contact: UserType
}
export type UserType = {
    id: number;
    username: string;
    jwt: string;
    online: boolean;
    lastSeen?: number;
}

export type MessageType = {
    id: number
    text: string
    timestamp: number
    author: UserType
    chatId: number,
    replyTo: MessageType
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
}

export type ContactRequestType = {
    id: number
    fromUser: UserType
    toUser: UserType
    approved: boolean
    cancelled: boolean
}

export type ContactRequestCreateType = {
    fromUser: number,
    toUser: number,
}
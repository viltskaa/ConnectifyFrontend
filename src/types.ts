export type UserType = {
    id: number;
    username: string;
    jwt: string;
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
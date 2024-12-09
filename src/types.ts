export type UserType = {
    username: string;
    jwt: string;
}

export type MessageType = {
    id: number
    text: string
    timestamp: number
    author: UserType
}
import React, {createContext, ReactNode, useState} from 'react';
import {ChatType} from "../types.ts";

export interface ChatProviderContextType {
    selectedChat?: ChatType,
    setSelectedChat?: (chat: ChatType) => void,
}

const defaultValue: ChatProviderContextType = {
    selectedChat: undefined,
    setSelectedChat: undefined,
}

export const ChatProviderContext = createContext<ChatProviderContextType>(defaultValue)

interface ChatProviderProps {
    children: ReactNode;
}

const ChatProvider = ({children}: ChatProviderProps): React.ReactElement => {
    const [selectedChat, setSelectedChat] = useState<ChatType>()
    
    return (
        <ChatProviderContext.Provider value={{selectedChat, setSelectedChat}}>
            {children}
        </ChatProviderContext.Provider>
    );
};

export default ChatProvider;
import {useContext} from "react";
import {ChatProviderContext} from "../providers/ChatProvider.tsx";

export const useSelectedChat = () => {
    const {selectedChat, setSelectedChat} = useContext(ChatProviderContext)
    return {selectedChat, setSelectedChat}
}
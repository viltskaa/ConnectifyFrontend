import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import Chat from "../Chat/Chat.tsx";
import {ChatType} from "../../types.ts";

const ChatWrapper = (): React.ReactElement => {
    const {activeChat, messages} = useSelector((state: RootState) => state.chat);
    const [selectedChat, setSelectedChat] = useState<ChatType>();

    useEffect(() => {
        setSelectedChat(() => activeChat ? activeChat : undefined);
    }, [activeChat])

    return (
        <div className="h-100 p-4 flex-fill">
            <Chat
                messages={selectedChat && selectedChat.id && messages[selectedChat.id] || []}
                activeChat={selectedChat}
            />
        </div>
    );
};

export default ChatWrapper;
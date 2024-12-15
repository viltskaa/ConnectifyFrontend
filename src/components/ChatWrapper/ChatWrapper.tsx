import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import Chat from "../Chat/Chat.tsx";
import {ChatType} from "../../types.ts";

const ChatWrapper = (): React.ReactElement => {
    const dispatch = useDispatch();
    const {activeChatId, messages, chats} = useSelector((state: RootState) => state.chat);
    const [selectedChat, setSelectedChat] = useState<ChatType>();

    useEffect(() => {
        setSelectedChat(() => activeChatId ? chats[activeChatId] : undefined);
    }, [activeChatId, dispatch])

    return (
        <div className="h-100 p-4 flex-fill">
            <Chat
                messages={messages[activeChatId!] || []}
                activeChat={selectedChat}
            />
        </div>
    );
};

export default ChatWrapper;
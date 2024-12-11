import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import {useSelectedChat} from "../../hooks/useSelectedChat.ts";
import {setActiveChat} from "../../slices/chatSlice.ts";
import Chat from "../Chat/Chat.tsx";

const ChatWrapper = (): React.ReactElement => {
    const dispatch = useDispatch();
    const {activeChatId, messages} = useSelector((state: RootState) => state.chat);
    const {selectedChat} = useSelectedChat()

    useEffect(() => {
        if (selectedChat && selectedChat?.id) {
            dispatch(setActiveChat(selectedChat.id));
        }
    }, [dispatch, selectedChat])

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
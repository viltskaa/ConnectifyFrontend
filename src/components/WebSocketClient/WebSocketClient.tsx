import {useDispatch} from "react-redux";
import {useContext, useEffect} from "react";
import {useStomp} from "../../hooks/useStomp.ts";
import {UserContext} from "../../main.tsx";
import {ChatType, MessageType} from "../../types.ts";
import {addChat, addMessage} from "../../slices/chatSlice.ts";

const WebSocketClient = () => {
    const dispatch = useDispatch();
    const {subscribe, unsubscribe, active} = useStomp()
    const {user} = useContext(UserContext)

    useEffect(() => {
        if (!active || !user) return

        subscribe(`/app/chats/${user.id}`, (chats: ChatType[]) => {
            chats.forEach((chat: ChatType) => dispatch(addChat(chat)))
        })

        subscribe(`/topic/chats/${user.id}`, (chat: ChatType) => {
            dispatch(addChat(chat))
        })

        subscribe(`/app/history/${user.id}`, (messages: MessageType[]) => {
            messages.forEach((message: MessageType) => dispatch(addMessage(message)))
        })

        subscribe(`/topic/messages/${user.id}`, (message: MessageType) => {
            dispatch(addMessage(message))
        });

        return () => {
            unsubscribe(`/app/chats/${user.id}`)
            unsubscribe(`/topic/chats/${user.id}`)
            unsubscribe(`/app/history/${user.id}`)
            unsubscribe(`/topic/messages/${user.id}`)
        }
    }, [dispatch, active, user]);

    return null
};

export default WebSocketClient;
import {useDispatch, useSelector} from "react-redux";
import {useContext, useEffect, useState} from "react";
import {useStomp} from "../../hooks/useStomp.ts";
import {UserContext} from "../../main.tsx";
import {ChatType, ContactType, ContactRequestType, MessageType} from "../../types.ts";
import {
    addChat,
    addContact,
    addMessage,
    addRequest,
    deleteChat,
    removeRequest, setActiveChat,
    updateChat
} from "../../slices/chatSlice.ts";
import {RootState} from "../../store/store.ts";
import {useNotification} from "../../hooks/useNotification.ts";

const WebSocketClient = () => {
    const dispatch = useDispatch();
    const {subscribe, unsubscribe, active} = useStomp()
    const {chats, activeChat} = useSelector((state: RootState) => state.chat);
    const [localActiveChatId, setLocalActiveChatId] = useState<number | null>(null);
    const {user} = useContext(UserContext)
    const notification = useNotification();

    const sendNotification = (message: MessageType) => {
        if (((localActiveChatId !== message.chatId) || !localActiveChatId)
            && (user && user.id !== message.author.id)) {
            notification({
                message: `Новое сообщение от ${message.author.username}`,
                description: message.text,
                showProgress: true,
                placement: "bottomLeft",
                onClick: () => {
                    const chat = chats[message.chatId]
                    dispatch(setActiveChat(chat))
                }
            })
        }
    }

    useEffect(() => {
        setLocalActiveChatId(activeChat ? activeChat.id : null)
    }, [activeChat]);

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

        subscribe(`/topic/requests/${user.id}`, (request: ContactRequestType) => {
            dispatch(addRequest(request))
        })

        subscribe(`/app/historyRequests/${user.id}`, (requests: ContactRequestType[]) => {
            requests.forEach((request: ContactRequestType) => dispatch(addRequest(request)))
        })

        subscribe(`/topic/cancelRequest/${user.id}`, (request: ContactRequestType) => {
            dispatch(addRequest(request))
            dispatch(removeRequest(request.id))
        })

        subscribe(`/topic/approveRequest/${user.id}`, (request: ContactRequestType) => {
            dispatch(addRequest(request))
            dispatch(removeRequest(request.id))
        })

        subscribe(`/app/contacts/${user.id}`, (contacts: ContactType[]) => {
            contacts.forEach((contact: ContactType) => dispatch(addContact(contact)))
        })

        subscribe(`/topic/addContact/${user.id}`, (contact: ContactType) => {
            dispatch(addContact(contact))
        })

        subscribe(`/topic/leaveChat/${user.id}`, (chat: ChatType) => {
            dispatch(deleteChat(chat.id))
        })

        subscribe(`/topic/updateChat/${user.id}`, (chat: ChatType) => {
            dispatch(updateChat(chat))
        })

        return () => {
            unsubscribe(`/app/chats/${user.id}`)
            unsubscribe(`/topic/chats/${user.id}`)
            unsubscribe(`/app/history/${user.id}`)
            unsubscribe(`/topic/requests/${user.id}`)
            unsubscribe(`/app/historyRequests/${user.id}`)
            unsubscribe(`/app/contacts/${user.id}`)
            unsubscribe(`/topic/leaveChat/${user.id}`)
        }
    }, [dispatch, active, user]);

    useEffect(() => {
        if (!active || !user || !chats) return

        Object.values(chats).flat().forEach(({id}: ChatType) => {
            subscribe(`/topic/messages/${id}`, (message: MessageType) => {
                dispatch(addMessage(message))
                sendNotification(message)
            });
            subscribe(`/topic/deleteChat/${id}`, (chatId: number) => {
                dispatch(deleteChat(chatId))
            })
        })

        return () => {
            Object.values(chats).flat().forEach(({id}: ChatType) => {
                unsubscribe(`/topic/messages/${id}`)
                unsubscribe(`/topic/deleteChat/${id}`)
            })
        }

    }, [chats, dispatch, user, active]);

    return null
};

export default WebSocketClient;
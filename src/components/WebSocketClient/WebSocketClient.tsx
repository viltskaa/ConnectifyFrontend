import {useDispatch, useSelector} from "react-redux";
import {useContext, useEffect} from "react";
import {useStomp} from "../../hooks/useStomp.ts";
import {UserContext} from "../../main.tsx";
import {ChatType, ContactRequestType, MessageType} from "../../types.ts";
import {addChat, addMessage, addRequest} from "../../slices/chatSlice.ts";
import {RootState} from "../../store/store.ts";

const WebSocketClient = () => {
    const dispatch = useDispatch();
    const {subscribe, unsubscribe, active} = useStomp()
    const {chats} = useSelector((state: RootState) => state.chat);
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

        subscribe(`/topic/requests/${user.id}`, (request: ContactRequestType) => {
            dispatch(addRequest(request))
        })

        subscribe(`/app/historyRequests/${user.id}`, (requests: ContactRequestType[]) => {
            requests.forEach((request: ContactRequestType) => dispatch(addRequest(request)))
        })

        subscribe(`/topic/cancelRequest/${user.id}`, (request: ContactRequestType) => {
            dispatch(addRequest(request))
        })

        subscribe(`/topic/approveRequests/${user.id}`, (request: ContactRequestType) => {
            dispatch(addRequest(request))
        })

        return () => {
            unsubscribe(`/app/chats/${user.id}`)
            unsubscribe(`/topic/chats/${user.id}`)
            unsubscribe(`/app/history/${user.id}`)
            unsubscribe(`/topic/requests/${user.id}`)
            unsubscribe(`/app/historyRequests/${user.id}`)
        }
    }, [dispatch, active, user]);

    useEffect(() => {
        if (!active || !user || !chats) return

        Object.values(chats).flat().forEach(({id}: ChatType) => {
            subscribe(`/topic/messages/${id}`, (message: MessageType) => {
                dispatch(addMessage(message))
            });
        })

        return () => {
            Object.values(chats).flat().forEach(({id}: ChatType) => unsubscribe(`/topic/messages/${id}`))
        }

    }, [chats, dispatch, user, active]);

    return null
};

export default WebSocketClient;
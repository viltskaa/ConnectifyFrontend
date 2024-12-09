import React, {useEffect, useState} from 'react';
import {MessageType, UserType} from "../../types.ts";
import Messages from "../Messages/Messages.tsx";
import PublishComponent from "../PublicComponent/PublishComponent.tsx";
import {Divider} from "antd";
import {useStomp} from "../../hooks/useStomp.ts";

export type ChatProps = {
    user: UserType;
    chatId: number;
    loading: boolean;
}

const Chat = ({user, chatId, loading}: ChatProps): React.ReactElement => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const {subscribe, send, unsubscribe, active} = useStomp()

    useEffect(() => {
        if (!active) return;

        subscribe("/app/history", (message: MessageType[]) => {
            console.log(message)
            setMessages(message)
        })
        subscribe("/topic/messages", (message: MessageType) => {
            console.log(message)
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            unsubscribe("/app/history");
            unsubscribe("/topic/messages");
        };
    }, [active]);

    const sendMessage = (messageStr: string) => {
        send("/app/sendMessage", {text: messageStr, jwt: user?.jwt,}, {})
    }

    return (
        <div className='d-flex flex-column max-h-100 p-4 border rounded-2 shadow-sm'>
            <h3 className="mb-1">CHAT <small className="text-secondary fs-6 align-text-top">#{chatId}</small></h3>
            <Divider/>
            <Messages messages={messages} user={user}/>
            <PublishComponent onPublish={sendMessage}/>
        </div>
    );
};

export default Chat;
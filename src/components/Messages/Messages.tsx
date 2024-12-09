import React, {useEffect, useRef} from 'react';
import Message from "../Message/Message.tsx";
import {MessageType, UserType} from "../../types.ts";
import "./Messages.css"

export type MessagesProps = {
    messages: MessageType[]
    user: UserType
}

const Messages = ({messages, user}: MessagesProps): React.ReactElement => {
    const ref = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    return (
        <div className="messages">
            {messages && messages.length > 0 && (messages.map((message) => (
                <Message
                    key={message.id}
                    message={message.text}
                    username={message.author.username}
                    variant={message.author.username === user?.username ? "right" : "left"}
                    time={message.timestamp}
                />
            )))}
            <div ref={ref}></div>
        </div>
    );
};

export default Messages;
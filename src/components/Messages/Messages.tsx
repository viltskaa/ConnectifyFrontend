import React, {useEffect, useRef} from 'react';
import Message, {MessageOptions} from "../Message/Message.tsx";
import {MessageType, UserType} from "../../types.ts";
import "./Messages.css"
import SkeletonMessage from "./SkeletonMessage.tsx";
import {Button, Flex} from "antd";

export type MessagesProps = {
    messages: MessageType[]
    user: UserType
    loading?: boolean
    onReply?: (reply: MessageType) => void
    onFirstMessage?: () => void
}

const Messages = ({messages, user, loading, onReply, onFirstMessage}: MessagesProps): React.ReactElement => {
    const ref = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => ref.current?.scrollIntoView({ behavior: "smooth" })

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const onOption = (option: MessageOptions, id: number) => {
        if (onReply && option === 'reply') {
            const replayedMessage = messages.find(e => e.id === id)
            if (replayedMessage) {
                onReply(replayedMessage)
                scrollToBottom()
            }
        }
    }

    return (
        <div className="messages">
            {messages && messages.length == 0 && (
                <Flex className='h-100' justify='center' align='center' vertical>
                    <h3>Тут пока пусто</h3>
                    <Button onClick={() => onFirstMessage && onFirstMessage()} type='link'>
                        <span>Начните общение отправив первое сообщение! <i className="ms-2 bi bi-magic"></i></span>
                    </Button>
                </Flex>
            )}
            {!loading && messages && messages.length > 0 && (messages.map((message) => (
                <Message
                    key={message.id}
                    id={message.id}
                    message={message.text}
                    username={message.author.username}
                    variant={message.author.username === user?.username ? "right" : "left"}
                    time={message.timestamp}
                    onOption={onOption}
                    reply={message.replyTo}
                />
            )))}
            {loading && (
                <>
                    <SkeletonMessage variant={'left'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'left'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'left'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'left'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'left'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'left'}/>
                    <SkeletonMessage variant={'right'}/>
                    <SkeletonMessage variant={'left'}/>
                </>
            )}
            <div ref={ref}></div>
        </div>
    );
};

export default Messages;
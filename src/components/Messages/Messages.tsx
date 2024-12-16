import React, {useEffect, useRef} from 'react';
import Message, {MessageOptions} from "../Message/Message.tsx";
import {MessageType, UserType} from "../../types.ts";
import "./Messages.css"
import SkeletonMessage from "./SkeletonMessage.tsx";
import {Button, Flex, message} from "antd";

export type MessagesProps = {
    messages: MessageType[]
    user: UserType
    loading?: boolean
    onReply?: (reply: MessageType) => void
    onForward?: (forward: MessageType) => void
    onFirstMessage?: () => void
    selectedMessage?: MessageType
    onAvatarClick?: (user: UserType) => void
}

const Messages = ({
                      messages,
                      user,
                      loading,
                      onReply,
                      onForward,
                      onFirstMessage,
                      selectedMessage,
                      onAvatarClick,
                  }: MessagesProps): React.ReactElement => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => ref.current?.scrollIntoView({behavior: "smooth"})

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        if (selectedMessage?.id && containerRef.current) {
            const index = messages.findIndex((msg) => msg.id === selectedMessage.id);
            if (index !== -1) {
                const element = containerRef.current.children[index] as HTMLDivElement;
                if (element) {
                    element.classList.add("highlight");
                    setTimeout(() => element.classList.remove('highlight'), 2000);
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }
        }
    }, [messages, selectedMessage]);

    const onOption = (option: MessageOptions, id: number) => {
        if (onReply && option === 'reply') {
            const replayedMessage = messages.find(e => e.id === id)
            if (replayedMessage) {
                onReply(replayedMessage)
                scrollToBottom()
            }
        } else if (onForward && option === 'forward') {
            const forwardMessage = messages.find(e => e.id === id)
            if (forwardMessage) {
                onForward(forwardMessage)
            }
        } else if (option === 'copy') {
            const copyMessage = messages.find(e => e.id === id)
            if (copyMessage) {
                navigator.clipboard
                    .writeText(copyMessage.text)
                    .then(() => message.success("Успешно копирование"))
            }
        }
    }

    return (
        <div ref={containerRef} className="messages">
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
                    onAvatarClick={() => onAvatarClick && onAvatarClick(message.author)}
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
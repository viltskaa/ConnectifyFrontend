import React, {useContext, useState} from 'react';
import {ChatType, MessageType} from "../../types.ts";
import Messages from "../Messages/Messages.tsx";
import PublishComponent from "../PublicComponent/PublishComponent.tsx";
import {Button, Divider, Flex, Tooltip} from "antd";
import {useStomp} from "../../hooks/useStomp.ts";
import './Chat.css'
import {UserContext} from "../../main.tsx";

export type ChatProps = {
    loading?: boolean;
    messages: MessageType[]
    activeChat?: ChatType;
}

const Chat = ({loading, messages, activeChat}: ChatProps): React.ReactElement => {
    const [replyMessage, setReplyMessage] = useState<MessageType>()
    const [focused, setFocused] = useState<boolean>(false);
    const {send, active} = useStomp()
    const {user} = useContext(UserContext)

    const sendMessage = (messageStr: string) => {
        if (!user || !user.jwt || !activeChat || !active) return;

        const message = {
            text: messageStr,
            jwt: user?.jwt,
            replyId: replyMessage?.id.toString() || "null",
            chatId: activeChat.id.toString(),
        }
        send(`/app/sendMessage/${user.id}`, message, {})
        if (replyMessage) {
            setReplyMessage(undefined)
        }
    }

    const sendFirstMessage = () => sendMessage("Привет!")

    return (
        <div className='d-flex flex-column max-h-100 p-4 border-0 rounded-2 shadow-sm'>
            {activeChat && (
                <>
                    <Flex align='center' justify='space-between'>
                        <div className="">
                            <h3 className="mb-1">
                                {activeChat?.chatName}
                                <small className="text-secondary fs-6 align-text-top ms-2">#{activeChat?.id}</small>
                            </h3>
                            <small>
                                {`В сети ${activeChat?.users.reduce((a, b) => a + (b.online ? 1 : 0), -1)}`}
                                {`/${activeChat?.users.length - 1}`}</small>
                        </div>
                        <Button icon={<i className="bi bi-gear-wide-connected fs-3 text-dark"></i>} type='link'/>
                    </Flex>
                    <Divider/>
                    {user && (
                        <Messages
                            messages={messages}
                            user={user}
                            loading={loading}
                            onReply={(msg) => {
                                setReplyMessage(msg)
                                setFocused(true)
                            }}
                            onFirstMessage={sendFirstMessage}
                        />
                    )}
                    {replyMessage && (
                        <Flex justify="space-between" align='center' className="p-2 border rounded-2 shadow my-2">
                            <Flex gap="small" align={'stretch'}>
                                <div className="divider-primary"></div>
                                <Flex vertical>
                                    <small className="me-2 h-100 text-primary">{replyMessage.author.username}</small>
                                    <small>{replyMessage.text}</small>
                                </Flex>
                            </Flex>
                            <Tooltip title="Отменить">
                                <Button onClick={() => setReplyMessage(undefined)}
                                        icon={<i className="bi bi-x-lg"></i>}/>
                            </Tooltip>
                        </Flex>
                    )}
                    <PublishComponent focused={focused} onPublish={sendMessage}/>
                </>
            )}
            {!activeChat && (
                <Flex className='h-100' justify='center' align='center' vertical>
                    <h4 className='text-secondary'>Для начала общения выберите чат</h4>
                </Flex>
            )}
        </div>
    );
};

export default Chat;
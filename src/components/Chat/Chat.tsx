import React, {useContext, useState} from 'react';
import {ChatType, MessageType} from "../../types.ts";
import Messages from "../Messages/Messages.tsx";
import PublishComponent from "../PublicComponent/PublishComponent.tsx";
import {Avatar, Button, Divider, Flex, List, message, Modal, Popconfirm, Tooltip} from "antd";
import {useStomp} from "../../hooks/useStomp.ts";
import './Chat.css'
import {UserContext} from "../../main.tsx";
import UserProfile from "../UserProfile/UserProfile.tsx";
import {setActiveChat} from "../../slices/chatSlice.ts";
import {useDispatch} from "react-redux";

export type ChatProps = {
    loading?: boolean;
    messages: MessageType[]
    activeChat?: ChatType;
}

const Chat = ({loading, messages, activeChat}: ChatProps): React.ReactElement => {
    const [replyMessage, setReplyMessage] = useState<MessageType>()
    const [focused, setFocused] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const {send, active} = useStomp()
    const dispatch = useDispatch();
    const {user} = useContext(UserContext)

    const sendMessage = (messageStr: string) => {
        if (!user || !user.id || !activeChat || !active) return;

        const message = {
            text: messageStr,
            userId: user?.id.toString(),
            replyId: replyMessage?.id.toString() || "null",
            chatId: activeChat.id.toString(),
            type: "COMMON"
        }
        send(`/app/sendMessage/${user.id}`, message, {})
        if (replyMessage) {
            setReplyMessage(undefined)
        }
    }

    const deleteChat = () => {
        if (!activeChat || !active || !user) return;

        send(`/app/deleteChat/${activeChat.id}`, {userId: user.id.toString()}, {})
        setModalOpen(false)
        dispatch(setActiveChat(null))
        message.success(`Чат ${activeChat.chatName} успешно удален!`).then(() => {})
    }

    const leaveFromChat = () => {
        if (!activeChat || !active || !user) return;

        send(`/app/leaveChat/${activeChat.id}`, {userId: user.id.toString()}, {})
        setModalOpen(false)
        dispatch(setActiveChat(null))
        message.success(`Вы успешно вышли из чата ${activeChat.chatName}`).then(() => {})
    }

    const sendFirstMessage = () => sendMessage("Привет!")

    return (
        <div className='d-flex flex-column max-h-100 p-4 border-0 rounded-2 shadow-sm'>
            {activeChat && (
                <>
                    <Flex onClick={() => setModalOpen(true)} className="chat-name" align='center' gap='small'>
                        <Avatar
                            style={{
                                color: activeChat?.color,
                                backgroundColor: "#ffffff00",
                            }}
                            size='large'
                            className="border-0 shadow-sm"
                            shape="square"
                            icon={(<i className={activeChat?.icon || "bi bi-chat-left"}></i>)}
                        />
                        <div className="">
                            <h3 className="mb-0">
                                {activeChat?.chatName}
                                <small className="text-secondary fs-6 align-text-top ms-2">#{activeChat?.id}</small>
                            </h3>
                            <small className="">
                                <i className="bi bi-circle-fill fs-small me-1 text-success"></i>
                                {`${activeChat?.users.reduce((a, b) => a + (b.online ? 1 : 0), -1)}`}
                            </small>
                        </div>
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
                    {user && (
                        <PublishComponent
                            users={activeChat?.users.filter(chatUser => chatUser.id !== user.id)}
                            focused={focused}
                            onPublish={sendMessage}
                        />
                    )}
                </>
            )}
            {!activeChat && (
                <Flex className='h-100' justify='center' align='center' vertical>
                    <h4 className='text-secondary'>Для начала общения выберите чат</h4>
                </Flex>
            )}
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                centered
                footer={null}
                title={<h3>{`Чат ${activeChat?.chatName}`}</h3>}
            >
                <Divider>
                    <h6 className="text-secondary">Функции</h6>
                </Divider>
                <Flex gap="small" vertical>
                    <Button size="small" icon={<i className="bi bi-sliders"/>} className="w-100">
                        Изменить настройки чата
                    </Button>
                    <Button size="small" icon={<i className="bi bi-file-earmark-arrow-up"/>} className="w-100">
                        Экспорт чата
                    </Button>
                    {activeChat && user && activeChat.owner.id === user.id && (
                        <Popconfirm
                            title="Удаление чата"
                            description="Вы точно хотите удалить чат?"
                            onConfirm={() => deleteChat()}
                            okText="Удалить"
                            cancelText="Отмена"
                        >
                            <Button size="small" icon={<i className="bi bi-trash"/>} danger className="w-100">
                                Удалить чат
                            </Button>
                        </Popconfirm>
                    )}
                    {activeChat && user && (
                        <Popconfirm
                            title="Выход из чата"
                            description="Вы точно хотите выйти из чата?"
                            onConfirm={() => leaveFromChat()}
                            okText="Выйти"
                            cancelText="Отмена"
                        >
                            <Button size="small" icon={<i className="bi bi-door-open"/>} danger className="w-100">
                                Выйти из чата
                            </Button>
                        </Popconfirm>
                    )}
                </Flex>
                <Divider>
                    <h6 className="text-secondary">Создатель</h6>
                </Divider>
                <UserProfile user={activeChat?.owner}/>
                {activeChat && activeChat.users && activeChat.users.length > 1 && (
                    <>
                        <Divider>
                            <h6 className="text-secondary">Участники</h6>
                        </Divider>
                        <List
                            pagination={{position: "bottom", align: "center", pageSize: 5}}
                            dataSource={activeChat.users.filter(x => x.id !== activeChat.owner.id)}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <UserProfile user={item} key={index}/>
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Chat;
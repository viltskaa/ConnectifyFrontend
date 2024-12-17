import React, {useContext, useEffect, useState} from 'react';
import {ChatType, ContactType, MessageType, UserType} from "../../types.ts";
import Messages from "../Messages/Messages.tsx";
import PublishComponent from "../PublishComponent/PublishComponent.tsx";
import {Avatar, Button, Divider, Flex, List, message, Modal, Popconfirm, Tooltip} from "antd";
import {useStomp} from "../../hooks/useStomp.ts";
import './Chat.css'
import {UserContext} from "../../main.tsx";
import UserProfile from "../UserProfile/UserProfile.tsx";
import {setActiveChat, setForwardMessage} from "../../slices/chatSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import UsersModal from "../UsersModal/UsersModal.tsx";
import ChatUpdateModal from "../ChatUpdate/ChatUpdateModal.tsx";
import MessageFinder from "../MessageFinder/MessageFinder.tsx";
import ChatSelectModal from "../ChatsSelectModal/ChatSelectModal.tsx";
import {RootState} from "../../store/store.ts";
import UserProfileModal from "../UserProfileModal/UserProfileModal.tsx";
import AiHelpModal from "../AiHelpModal/AiHelpModal.tsx";
import ExportModal from "../ExportModal/ExportModal.tsx";

export type ChatProps = {
    loading?: boolean;
    messages?: MessageType[]
    activeChat?: ChatType;
}

const Chat = ({loading, messages, activeChat}: ChatProps): React.ReactElement => {
    const {forwardMessage} = useSelector((state: RootState) => state.chat);

    const [replyMessage, setReplyMessage] = useState<MessageType>()
    const [focused, setFocused] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [usersModalOpen, setUsersModalOpen] = useState<boolean>(false)
    const [chatEditModalOpen, setChatEditModalOpen] = useState<boolean>(false)
    const [messageFinderOpen, setMessageFinderOpen] = useState<boolean>(false)
    const [chatSelectModalOpen, setChatSelectModalOpen] = useState<boolean>(false)
    const [selectedMessage, setSelectedMessage] = useState<MessageType>()
    const [userProfileOpenModal, setUserProfileOpenModal] = useState<boolean>(false)
    const [activeUserAvatar, setActiveUserAvatar] = useState<UserType>()
    const [aiHelpModalOpen, setAiHelpModalOpen] = useState<boolean>(false)
    const [aiHelpMessage, setAiHelpMessage] = useState<string | null>(null)
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false)
    const {send, active} = useStomp()
    const dispatch = useDispatch();
    const {user} = useContext(UserContext)

    useEffect(() => {
        if (forwardMessage) {
            setReplyMessage(forwardMessage)
            dispatch(setForwardMessage(null))
        }
    }, [dispatch, forwardMessage])

    const sendMessage = (messageStr: string) => {
        if (!user || !user.id || !activeChat || !active) return;

        const message = {
            text: messageStr,
            userId: user?.id.toString(),
            replyId: replyMessage?.id.toString() || "null",
            chatId: activeChat.id.toString(),
            type: "COMMON"
        }
        send(`/app/sendMessage/${activeChat.id}`, message, {})
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

    const deleteFromChat = (userInChat: UserType) => {
        if (!activeChat || !active || !userInChat) return;

        send(`/app/leaveChat/${activeChat.id}`, {userId: userInChat.id.toString()}, {})
        setModalOpen(false)
        message.success(`Вы успешно выгнали ${userInChat.username} из чата ${activeChat.chatName}`).then(() => {})
    }

    const appendChat = (contacts: ContactType[]) => {
        if (!activeChat || !active || !user || !contacts || contacts.length === 0) return;

        send(`/app/appendChat/${activeChat.id}`, {
            users: contacts.map((contact: ContactType) => contact.contact.id).toString()
        }, {})
        setUsersModalOpen(false)
        message.success(`Вы успешно добавили пользователей в чат`).then(() => {setModalOpen(false)})
    }

    const sendFirstMessage = () => sendMessage("Привет!")

    const onSelectMessage = (selectedMessage: MessageType) => {
        setModalOpen(false)
        setSelectedMessage(selectedMessage)
    }

    const onForwardMessageSelect = (message: MessageType) => {
        setChatSelectModalOpen(true)
        dispatch(setForwardMessage(message))
    }

    const onCancelForwardMessage = () => {
        setChatSelectModalOpen(false)
        dispatch(setForwardMessage(null))
    }

    const onSelectChatToForwardMessage = (chat: ChatType) => {
        setChatSelectModalOpen(false)
        dispatch(setActiveChat(chat))
    }

    const onAvatarClick = (user: UserType) => {
        setActiveUserAvatar(user)
        setUserProfileOpenModal(true)
    }

    const onAiHelp = (message: MessageType) => {
        setAiHelpMessage(message.text)
        setAiHelpModalOpen(true)
    }

    return (
        <div className='d-flex flex-column max-h-100 p-4 border-0 rounded-2 shadow-sm'>
            {activeChat && messages && (
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
                                {activeChat.chatName}
                                <small className="text-secondary fs-6 align-text-top ms-2">#{activeChat.id}</small>
                            </h3>
                            <small className="">
                                <i className="bi bi-circle-fill fs-small me-1 text-success"></i>
                                {`${activeChat.users.reduce((a, b) => a + (b.online ? 1 : 0), -1)}`}
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
                            onForward={onForwardMessageSelect}
                            onAiHelp={onAiHelp}
                            onFirstMessage={sendFirstMessage}
                            selectedMessage={selectedMessage}
                            onAvatarClick={onAvatarClick}
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
                title={<h3>{activeChat?.chatName}</h3>}
                destroyOnClose
            >
                <Divider>
                    <h6 className="text-secondary">Функции</h6>
                </Divider>
                <Flex gap="small" vertical>
                    <Button
                        onClick={() => {
                            setSelectedMessage(undefined);
                            setMessageFinderOpen(true)
                        }}
                        size="small"
                        icon={<i className="bi bi-search"/>}
                        className="w-100"
                    >
                        Поиск по сообщениям
                    </Button>
                    <MessageFinder
                        open={messageFinderOpen}
                        onClose={() => setMessageFinderOpen(false)}
                        onSelect={(msg) => onSelectMessage(msg)}
                    />
                    {activeChat && user && activeChat.owner.id === user.id && (
                        <>
                            <Button
                                onClick={() => setChatEditModalOpen(true)}
                                size="small"
                                icon={<i className="bi bi-sliders"/>}
                                className="w-100"
                            >
                                Изменить настройки чата
                            </Button>
                            <ChatUpdateModal
                                open={chatEditModalOpen}
                                onClose={() => setChatEditModalOpen(false)}
                                chat={activeChat}
                            />
                            <Button
                                size="small"
                                icon={<i className="bi bi-file-earmark-arrow-up"/>}
                                className="w-100"
                                onClick={() => setExportModalOpen(true)}
                            >
                                Экспорт чата
                            </Button>
                            <ExportModal
                                open={exportModalOpen}
                                onClose={() => setExportModalOpen(false)}
                                chatId={activeChat.id}
                            />
                            <Button
                                onClick={() => setUsersModalOpen(true)}
                                size="small"
                                icon={<i className="bi bi-person-plus"/>}
                                className="w-100"
                            >
                                Добавить пользователей в чат
                            </Button>
                            <UsersModal
                                open={usersModalOpen}
                                chatUsers={activeChat.users.map(user => user.id)}
                                onClose={() => setUsersModalOpen(false)}
                                onFinish={appendChat}
                            />
                        </>
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
                    {activeChat && user && activeChat.owner.id === user.id && (
                        <Popconfirm
                            title="Удаление чата"
                            description="Вы точно хотите удалить чат?"
                            onConfirm={() => deleteChat()}
                            okText="Удалить"
                            cancelText="Отмена"
                        >
                            <Button type="primary" size="small" icon={<i className="bi bi-trash"/>} danger className="w-100">
                                Удалить чат
                            </Button>
                        </Popconfirm>
                    )}
                </Flex>
                <Divider>
                    <h6 className="text-secondary">Создатель</h6>
                </Divider>
                <UserProfile user={activeChat?.owner}/>
                {activeChat && user && activeChat.users && activeChat.users.length > 1 && (
                    <>
                        <Divider>
                            <h6 className="text-secondary">Участники</h6>
                        </Divider>
                        <List
                            pagination={{position: "bottom", align: "center", pageSize: 5}}
                            dataSource={activeChat.users.filter(x => x.id !== activeChat.owner.id)}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <UserProfile
                                        user={item}
                                        key={index}
                                        rightButtonConfig={activeChat.owner.id === user.id ? {
                                            icon: "bi bi-person-dash",
                                            tooltipTitle: "Выгнать",
                                            type: "link",
                                            onClick: () => deleteFromChat(item),
                                        } : undefined}
                                    />
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </Modal>
            <ChatSelectModal
                open={chatSelectModalOpen}
                onClose={() => setChatSelectModalOpen(false)}
                onSelect={onSelectChatToForwardMessage}
                onCancel={onCancelForwardMessage}
            />
            {activeUserAvatar && (
                <UserProfileModal
                    open={userProfileOpenModal}
                    onClose={() => setUserProfileOpenModal(false)}
                    user={activeUserAvatar}
                />
            )}
            {aiHelpMessage && (
                <AiHelpModal
                    open={aiHelpModalOpen}
                    onClose={() => setAiHelpModalOpen(false)}
                    messageToExplain={aiHelpMessage}
                />
            )}
        </div>
    );
};

export default Chat;
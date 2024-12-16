import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Flex,
    List,
    Tabs,
    Tooltip
} from "antd";
import "./ChatList.css"
import {ChatType} from "../../types.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import UsersSearch from "../UsersSearch/UsersSearch.tsx";
import ChatCreate from "../ChatCreate/ChatCreate.tsx";
import {setActiveChat} from "../../slices/chatSlice.ts";
import DelayedInput from "../DelayedInput/DelayedInput.tsx";


const ChatList = (): React.ReactElement => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {chats} = useSelector((state: RootState) => state.chat);
    const [filteredChats, setFilteredChats] = useState<ChatType[]>([]);

    useEffect(() => {
        setFilteredChats(Object.values(chats).flat());
    }, [chats]);

    const onChatSelectLocal = (chat: ChatType) => dispatch(setActiveChat(chat))

    const showModal = () => setIsModalOpen(true);

    const onSearchChats = (value: string) => {
        if (value.length == 0) {
            setFilteredChats(Object.values(chats).flat());
        }

        setFilteredChats(() => Object.values(chats)
            .flat().filter(chat => chat.chatName.toLowerCase().includes(value.toLowerCase())))
    }

    return (
        <div className="border-0 rounded-2 shadow-sm w-100 flex-grow-1 overflow-y-scroll overflow-visible p-4 px-3">
            <Tabs
                className="h-100"
                defaultActiveKey="chats"
                centered
                items={[
                    {
                        key: "chats",
                        label: "Чаты",
                        icon: <i className="bi bi-chat-left"></i>,
                        children: (
                            <Flex vertical>
                                <Tooltip title={"Создать чат"}>
                                    <Button size='small' className='w-100' variant="outlined"
                                            onClick={() => showModal()}
                                            icon={<i className="bi bi-plus-lg"></i>}/>
                                </Tooltip>
                                <DelayedInput
                                    className={"mt-2"}
                                    timeoutValue={500}
                                    placeholder={"Поиск чатов"}
                                    onChange={onSearchChats}
                                />
                                <List
                                    className="mt-2"
                                    dataSource={filteredChats}
                                    locale={{emptyText: "Чаты не найдены"}}
                                    renderItem={(item, index) => (
                                        <List.Item
                                            className="chat-icon border-0"
                                            key={index}
                                            onClick={() => onChatSelectLocal(item)}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        style={{
                                                            color: item.color,
                                                            backgroundColor: "#ffffff00",
                                                        }}
                                                        className="border-0 shadow-sm chat-avatar"
                                                        shape="square"
                                                        icon={(<i className={item.icon || "bi bi-chat-left"}></i>)}
                                                    />
                                                }
                                                title={
                                                    <span className="text-truncate mb-0 fw-bold">{item.chatName}</span>
                                                }
                                                description={
                                                    <>
                                                        {item.lastMessage && (
                                                            <small
                                                                style={{maxWidth: "90%"}}
                                                                className='d-inline-block text-secondary text-truncate'
                                                            >
                                                                <b>{item.lastMessage.author.username}</b>:
                                                                {item.lastMessage.text}
                                                            </small>
                                                        )}
                                                        {!item.lastMessage && (
                                                            <small className='text-secondary'>Сообщений пока нет</small>
                                                        )}
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}/>
                            </Flex>
                        )
                    },
                    {
                        key: "friends",
                        label: "Контакты",
                        icon: <i className="bi bi-people-fill"></i>,
                        children: (<UsersSearch/>)
                    }
                ]}
            />
            <ChatCreate
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ChatList;
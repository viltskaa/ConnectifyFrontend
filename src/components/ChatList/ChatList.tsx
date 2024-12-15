import React, {useState} from 'react';
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
import {useSelectedChat} from "../../hooks/useSelectedChat.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import UsersSearch from "../UsersSearch/UsersSearch.tsx";
import ChatCreate from "../ChatCreate/ChatCreate.tsx";


const ChatList = (): React.ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {chats} = useSelector((state: RootState) => state.chat);
    const {setSelectedChat} = useSelectedChat()


    const onChatSelectLocal = (chat: ChatType) => {
        if (setSelectedChat) {
            setSelectedChat(chat);
        }
    }

    const showModal = () => setIsModalOpen(true);

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
                                <List
                                    className="mt-2"
                                    dataSource={Object.values(chats).flat()}
                                    renderItem={(item, index) => (
                                        <List.Item className="chat-icon border-0" key={index}
                                                   onClick={() => onChatSelectLocal(item)}>
                                            <Flex align='center' gap={"small"}>
                                                <Avatar
                                                    style={{
                                                        color: item.color,
                                                        backgroundColor: "#ffffff00",
                                                    }}
                                                    className="border-0 shadow-sm"
                                                    shape="square"
                                                    icon={(<i className={item.icon || "bi bi-chat-left"}></i>)}
                                                />
                                                <Flex vertical>
                                                    <span className="text-truncate mb-0 fw-bold">{item.chatName}</span>
                                                    {item.lastMessage && (
                                                        <small
                                                            className='text-secondary'><b>{item.lastMessage.author.username}</b>: {item.lastMessage.text}
                                                        </small>
                                                    )}
                                                    {!item.lastMessage && (
                                                        <small className='text-secondary'>Сообщений пока нет</small>
                                                    )}
                                                </Flex>
                                            </Flex>
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
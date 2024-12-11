import React, {useContext, useState} from 'react';
import {
    Avatar,
    Button,
    ColorPicker,
    Flex,
    Form,
    FormProps,
    Input,
    List,
    Modal,
    Select,
    Space,
    Tabs,
    Tooltip
} from "antd";
import "./ChatList.css"
import {ChatCreateType, ChatType} from "../../types.ts";
import {useStomp} from "../../hooks/useStomp.ts";
import {UserContext} from "../../main.tsx";
import {useSelectedChat} from "../../hooks/useSelectedChat.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import {icons} from "../../icons/icons.ts";


const ChatList = (): React.ReactElement => {
    const {chats} = useSelector((state: RootState) => state.chat);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const {setSelectedChat} = useSelectedChat()

    const {send, active} = useStomp()
    const {user} = useContext(UserContext)

    const onChatSelectLocal = (chat: ChatType) => {
        if (setSelectedChat) {
            setSelectedChat(chat);
        }
    }

    const showModal = () => setIsModalOpen(true);

    const onFinish: FormProps<ChatCreateType>['onFinish'] = (values) => {
        if (user && user.id && active) {
            send(`/app/createChat/${user.id}`, {...values, ownerId: user.id.toString()}, {})
            setIsModalOpen(false);
        }
    };

    return (
        <Flex className="border rounded-2 shadow-sm h-100 w-100 p-4 px-3" vertical>
            <Tabs
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
                                    dataSource={chats}
                                    renderItem={(item, index) => (
                                        <List.Item className="chat-icon" key={index}
                                                   onClick={() => onChatSelectLocal(item)}>
                                            <Flex align='center' gap={"small"}>
                                                <Avatar
                                                    style={{backgroundColor: item.color}}
                                                    shape="square"
                                                    icon={(<i className={item.icon || "bi bi-chat-left"}></i>)}
                                                />
                                                <Flex vertical>
                                                    <span className="text-truncate mb-0 fw-bold">{item.chatName}</span>
                                                    {item.lastMessage && (
                                                        <small className='text-secondary'><b>{item.lastMessage.author.username}</b>: {item.lastMessage.text}</small>
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
                        children: (
                            <Flex vertical>
                                <h1></h1>
                            </Flex>
                        )
                    }
                ]}
            />
            <Modal
                title={<h2>Chat Create</h2>}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}>
                <Form
                    name="chat"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<ChatCreateType>
                        label="Chat Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input chat name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<ChatCreateType>
                        label="Chat Color"
                        name="color"
                        rules={[
                            {
                                required: true,
                                message: 'Please select chat color!',
                            },
                        ]}
                        getValueProps={(value) => ({value: value})}
                        normalize={(value) => value && `${value.toHexString()}`}
                    >
                        <ColorPicker/>
                    </Form.Item>

                    <Form.Item<ChatCreateType>
                        label="Chat Icon"
                        name="icon"
                        rules={[
                            {
                                required: true,
                                message: 'Please select chat icon!',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            className='w-100'
                            placeholder="Search to Select"
                            optionFilterProp="label"
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={icons.map((value) => ({value: value.className, label: value.name}))}
                            optionRender={(option) => (
                                <Space>
                                    <i className={option.data.value}></i>
                                    {option.data.label}
                                </Space>
                            )}
                        />
                    </Form.Item>

                    <Form.Item className="w-100 mb-0" label={null}>
                        <Button type="primary" className="w-100" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal
            >
        </Flex>
    );
};

export default ChatList;
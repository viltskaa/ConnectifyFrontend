import React, {useEffect, useState} from 'react';
import {Avatar, Button, Flex, Modal, Tooltip} from "antd";
import DelayedInput from "../DelayedInput/DelayedInput.tsx";
import {ChatType} from "../../types.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import "./ChatSelectModal.css"

type ChatSelectModalProps = {
    open: boolean;
    onClose: () => void;
    onSelect: (chat: ChatType) => void;
    onCancel: () => void;
}

const ChatSelectModal = ({open, onClose, onSelect, onCancel}: ChatSelectModalProps): React.ReactElement => {
    const {chats, activeChat} = useSelector((state: RootState) => state.chat);
    const [filteredChats, setFilteredChats] = useState<ChatType[]>([]);
    const [filter, setFilter] = useState<string>("");

    useEffect(() => {
        if (activeChat) {
            setFilteredChats(Object.values(chats).flat().filter(x => x.id !== activeChat.id));
        }
    }, [chats, activeChat]);

    const onSearch = (value: string) => {
        if (!activeChat) return;

        setFilter(value)

        if (value.length === 0) {
            setFilteredChats(Object.values(chats).flat().filter(x => x.id !== activeChat.id));
            return;
        }

        setFilteredChats(Object.values(chats)
            .flat().filter(x => x.id !== activeChat.id)
            .filter(cht => cht.chatName.toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <Modal
            title="Выбор чата"
            open={open}
            onCancel={onClose}
            centered
            footer={null}
        >
            <Flex gap={"small"} vertical>
                <DelayedInput
                    timeoutValue={500}
                    onChange={onSearch}
                    placeholder={"Введите название чата"}
                />
                {filter && filteredChats.length == 0 && (
                    <small className="text-center">Чатов по фильтру {filter} не найдено</small>
                )}
                <Flex style={{maxHeight: "60vh"}} className="overflow-y-scroll" gap={"small"} vertical>
                    {filteredChats.length > 0 && filteredChats.map((chat: ChatType) => (
                        <Tooltip title="Нажмите для выбора чата">
                            <Flex
                                className="chat-select mb-2"
                                onClick={() => onSelect && onSelect(chat)}
                                key={chat.id}
                                align='center'
                                gap="small"
                            >
                                <Avatar
                                    style={{
                                        color: chat.color,
                                        backgroundColor: "#ffffff00",
                                    }}
                                    className="border-0 shadow-sm chat-avatar"
                                    shape="square"
                                    icon={(<i className={chat.icon || "bi bi-chat-left"}></i>)}
                                />
                                <span className="text-truncate mb-0 fw-bold">{chat.chatName}</span>
                            </Flex>
                        </Tooltip>
                    ))}
                </Flex>
                <Button onClick={onCancel} className="w-100">
                    Отменить
                </Button>
            </Flex>
        </Modal>
    );
};

export default ChatSelectModal;
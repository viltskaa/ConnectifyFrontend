import React, {useContext, useState} from 'react';
import {Avatar, Card, Flex, Modal, Tooltip} from "antd";
import {MessageType} from "../../types.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import DelayedInput from "../DelayedInput/DelayedInput.tsx";
import dayjs from "dayjs";
import HighlightAtWords from "../HighlightAtWords/HighlightAtWords.tsx";
import {UserContext} from "../../main.tsx";

type MessageFinderProps = {
    open: boolean;
    onClose: () => void;
    onSelect: (msg: MessageType) => void;
}

const MessageFinder = ({open, onClose, onSelect}: MessageFinderProps): React.ReactElement => {
    const {activeChat, messages} = useSelector((state: RootState) => state.chat);
    const [filteredMessages, setFilteredMessages] = useState<MessageType[]>([]);
    const [filter, setFilter] = useState<string>("");
    const {user} = useContext(UserContext);

    const onSearch = (value: string) => {
        if (!activeChat) return;
        setFilter(value)

        if (value.length === 0) {
            setFilteredMessages([]);
            return;
        }

        setFilteredMessages(messages[activeChat.id]
            .filter(msg => msg.text.toLowerCase().includes(value.toLowerCase())));
    }

    const onSelectLocal = (msg: MessageType) => {
        onClose()
        if (onSelect) {
            onSelect(msg);
        }
    }

    return (
        <Modal
            title={"Поиск по сообщениям"}
            open={open}
            onCancel={() => {
                setFilter("");
                onClose();
            }}
            centered
            footer={null}
            forceRender
            destroyOnClose
        >
            <Flex gap={"small"} vertical>
                <DelayedInput
                    timeoutValue={500}
                    onChange={onSearch}
                    placeholder={"Введите текст сообщения"}
                />
                {filter && filteredMessages.length == 0 && (
                    <small className="text-center">Сообщений по фильтру {filter} не найдено</small>
                )}
                <Flex style={{maxHeight: "60vh"}} className="overflow-y-scroll" gap={"small"} vertical>
                    {filteredMessages.length > 0 && filteredMessages.map((msg: MessageType) => (
                        <Flex
                            onClick={() => onSelectLocal(msg)}
                            key={msg.id}
                            align='center'
                            className={`message ${user?.username !== msg.author.username ? "message_left" : "message_right"}`}
                        >
                            <Avatar
                                className={"message_avatar border-0 shadow-sm"}
                                shape="square"
                                size={"small"}
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${msg.author.username}`}
                            />
                            <Card style={{maxWidth: "90%"}}>
                                <Tooltip title={"Перейти к сообщению"}>
                                    <Flex className="message-text px-1" gap="small" align='center'>
                                        <HighlightAtWords
                                            text={msg.text}
                                            className="mb-0 pre-wrap"
                                        />
                                        {msg.timestamp && (
                                            <small className="text-secondary message-time">
                                                {dayjs(msg.timestamp).format('HH:mm')}
                                            </small>
                                        )}
                                    </Flex>
                                </Tooltip>
                            </Card>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Modal>
    );
};

export default MessageFinder;
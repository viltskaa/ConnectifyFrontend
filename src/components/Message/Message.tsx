import React from 'react';
import {Avatar, Card, Dropdown, Flex, MenuProps} from "antd";

import './Message.css'
import {items} from "./MenuItems.tsx";
import {MessageType} from "../../types.ts";
import dayjs from "dayjs";

export type MessageOptions = "reply" | "forward" | "copy" | "like"

export type MessageProps = {
    message: string;
    id: number;
    variant: "left" | "right"
    username?: string
    time?: number
    onOption?: (option: MessageOptions, id: number) => void
    reply?: MessageType
}

const Message = ({message, variant = "left", username, time, onOption, id, reply}: MessageProps): React.ReactElement => {
    const onClick: MenuProps['onClick'] = ({ key }) => {
        console.log(key, message);
        if (onOption) onOption(key as MessageOptions, id)
    };

    return (
        <div className={`message message_${variant}`}>
            <Avatar
                className={"message_avatar border-0 shadow-sm"}
                shape="square"
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
            />
            <Card>
                <Dropdown disabled={!onOption} menu={{ items, onClick }} placement="bottom" arrow={{ pointAtCenter: true }}>
                    <Flex className="message-text px-1" vertical>
                        {reply && (
                            <Flex className="border rounded-2 p-1 mb-2 opacity-100 bg-light z-2 message-reply" vertical>
                                <small className="text-primary">{reply.author.username}</small>
                                <small className="fw-light text-truncate">{reply.text}</small>
                            </Flex>
                        )}
                        <pre className="mb-0">{message}</pre>
                        {time && (
                            <small className="text-end text-secondary message-time">
                                {dayjs(time).format('HH:mm')}
                            </small>
                        )}
                    </Flex>
                </Dropdown>
            </Card>
        </div>
    );
};

export default Message;
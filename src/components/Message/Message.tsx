import React from 'react';
import {Avatar, Card, Dropdown, Flex, MenuProps} from "antd";

import './Message.css'
import {items} from "./MenuItems.tsx";
import {MessageType} from "../../types.ts";
import dayjs from "dayjs";
import HighlightAtWords from "../HighlightAtWords/HighlightAtWords.tsx";

export type MessageOptions = "reply" | "forward" | "copy" | "ai"

export type MessageProps = {
    message: string;
    id: number;
    variant: "left" | "right"
    username?: string
    time?: number
    onOption?: (option: MessageOptions, id: number) => void
    reply?: MessageType,
    onAvatarClick?: () => void,
}

const Message = ({
                     message,
                     variant = "left",
                     username,
                     time,
                     onOption,
                     id,
                     reply,
                     onAvatarClick,
                 }: MessageProps): React.ReactElement => {
    const onClick: MenuProps['onClick'] = ({key}) => {
        console.log(key, message);
        if (onOption) onOption(key as MessageOptions, id)
    };

    return (
        <div className={`message message_${variant} p-1`}>
            <Avatar
                onClick={() => onAvatarClick && onAvatarClick()}
                className={"message_avatar border-0 shadow-sm"}
                shape="square"
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
            />
            <Card className="message-body">
                <Dropdown disabled={!onOption} menu={{items, onClick}} placement="bottom" arrow={{pointAtCenter: true}}>
                    <Flex className="message-text px-1" vertical>
                        {reply && (
                            <Flex className="border rounded-2 p-1 mb-2 opacity-100 bg-light z-2 message-reply" vertical>
                                <small className="text-primary">{reply.author.username}</small>
                                <small className="fw-light text-truncate">{reply.text}</small>
                            </Flex>
                        )}
                        <HighlightAtWords
                            text={message}
                            className="mb-0 pre-wrap"
                        />
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
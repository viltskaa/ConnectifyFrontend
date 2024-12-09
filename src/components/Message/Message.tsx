import React from 'react';
import {Avatar, Card, Flex} from "antd";

import './Message.css'

type MessageProps = {
    message: string;
    variant: "left" | "right"
    username?: string
    time?: number
}

const Message = ({message, variant = "left", username, time}: MessageProps): React.ReactElement => {
    return (
        <div className={`message message_${variant}`}>
            <Avatar className={"message_avatar"} shape={"square"}>
                {username || "User"}
            </Avatar>
            <Card>
                <Flex vertical>
                    <pre className="mb-0 px-1">{message}</pre>
                    {time && (
                        <small className="text-end text-secondary message-time">
                            {new Date(time).toLocaleDateString()}
                        </small>
                    )}
                </Flex>
            </Card>
        </div>
    );
};

export default Message;
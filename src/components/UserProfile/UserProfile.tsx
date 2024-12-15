import React from 'react';
import {Avatar, Button, Flex, Tooltip} from "antd";
import {UserType} from "../../types.ts";

type ButtonConfig = {
    icon: string,
    type: "link" | "default" | "text" | "primary" | "dashed" | undefined,
    tooltipTitle: string,
    onClick?: () => void,
}

type UserProfileProps = {
    user?: UserType
    className?: string
    onClick?: () => void
    rightButtonConfig?: ButtonConfig
}

const UserProfile = (
    {
        user,
        className,
        onClick,
        rightButtonConfig,
    }: UserProfileProps): React.ReactElement => {
    return (
        <Flex
            onClick={() => onClick && onClick()}
            className={`border-0 rounded-2 shadow-sm w-100 p-2 ${className}`}
            align='center'
            gap='small'
            justify='space-between'
        >
            {user && (
                <div>
                    <Avatar
                        shape="square"
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                    />
                    <small className="ms-1 text-primary"><b>@</b>{user.username}</small>
                </div>
            )}
            {rightButtonConfig
                && rightButtonConfig.onClick
                && rightButtonConfig.tooltipTitle
                && rightButtonConfig.type
                && rightButtonConfig.icon
                && (
                <Tooltip title={rightButtonConfig.tooltipTitle}>
                    <Button
                        type={rightButtonConfig.type}
                        icon={<i className={rightButtonConfig.icon}></i>}
                        onClick={rightButtonConfig.onClick}
                    />
                </Tooltip>
            )}
        </Flex>
    );
};

export default UserProfile;
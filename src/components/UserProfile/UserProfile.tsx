import React from 'react';
import {Avatar, Button, Flex, Tooltip} from "antd";
import {UserType} from "../../types.ts";

type UserProfileProps = {
    user?: UserType
    className?: string
    onClick?: () => void
    onLeave?: () => void
}

const UserProfile = ({user, className, onClick, onLeave}: UserProfileProps): React.ReactElement => {
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
            {onLeave && (
                <Tooltip title="Выйти">
                    <Button type="link" icon={<i className="bi bi-box-arrow-right"></i>} onClick={onLeave}/>
                </Tooltip>
            )}
        </Flex>
    );
};

export default UserProfile;
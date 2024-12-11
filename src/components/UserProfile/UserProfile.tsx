import React, {useContext} from 'react';
import {Avatar, Flex} from "antd";
import {UserContext} from "../../main.tsx";

const UserProfile = (): React.ReactElement => {
    const {user} = useContext(UserContext)

    return (
        <Flex className='border rounded-2 shadow-sm w-100 p-2' align='center' gap='small'>
            {user && (
                <>
                    <Avatar
                        shape="square"
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                    />
                    <span><b>@</b>{user.username}</span>
                </>
            )}
        </Flex>
    );
};

export default UserProfile;
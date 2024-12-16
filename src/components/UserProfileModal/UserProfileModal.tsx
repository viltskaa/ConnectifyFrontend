import React from 'react';
import {UserType} from "../../types.ts";
import {Avatar, Flex, Modal} from "antd";

type UserProfileModalProps = {
    user: UserType
    open: boolean;
    onClose: () => void;
}

const UserProfileModal = ({user, open, onClose}: UserProfileModalProps): React.ReactElement => {
    return (
        <Modal
            title={"Профиль"}
            open={open}
            onCancel={onClose}
            destroyOnClose
            centered
            footer={null}
        >
            <Flex className="w-100" align={"center"} gap={"small"}>
                <p className="text-secondary mb-0">Логин пользователя:</p>
                <Flex className="border-0 p-1 rounded shadow-sm" align={'center'} gap={2}>
                    <Avatar
                        shape="square"
                        size={'small'}
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                    />
                    <p className='text-primary mb-0'>@{user.username}</p>
                </Flex>
            </Flex>
            <Flex className="mt-2 w-100" align={"center"} gap={"small"}>
                <p className="text-secondary mb-0">Почта пользователя:</p>
                <span>{user.email}</span>
            </Flex>
            <Flex className="mt-2 w-100" align={"center"} gap={"small"}>
                <p className="text-secondary mb-0 w-25">Описание профиля:</p>
                <span>{user.bio}</span>
            </Flex>
        </Modal>
    );
};

export default UserProfileModal;
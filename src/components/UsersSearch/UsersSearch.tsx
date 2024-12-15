import React, {useContext, useState} from 'react';
import DelayedInput from "../DelayedInput/DelayedInput.tsx";
import {Avatar, Button, Divider, Flex, Modal, Spin} from "antd";
import userApi from "../../api/UserApi.ts";
import {UserType} from "../../types.ts";
import {UserContext} from "../../main.tsx";
import UserProfile from "../UserProfile/UserProfile.tsx";
import {LoadingOutlined} from '@ant-design/icons';

import "./UserSearch.css"
import dayjs from "dayjs";
import {useStomp} from "../../hooks/useStomp.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import ContactRequest from "../ContactRequest/ContactRequest.tsx";
import Contact from "../Contact/Contact.tsx";

const UsersSearch = (): React.ReactElement => {
    const [users, setUsers] = useState<UserType[]>()
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType>();
    const {contactRequests, contacts} = useSelector((state: RootState) => state.chat);

    const {send, active} = useStomp()
    const {user} = useContext(UserContext);

    const {search} = userApi

    const onSearch = (value: string): void => {
        if (!user || !value) return

        const getData = async () => {
            setLoading(true);
            const data = await search(value, user.jwt)
            if (data instanceof Array) {
                setUsers(() => data
                    .filter(x => x.id !== user.id)
                    .filter(x => !Object.values(contactRequests).map(c => c.toUser.id).includes(x.id))
                )
            }
        }

        getData().finally(() => setLoading(false))
    }

    const selectUser = (userTo: UserType) => {
        setSelectedUser(userTo)
        setIsModalOpen(true)
    }

    const sendRequest = () => {
        if (!active || !user || !selectedUser) return

        send(`/app/createRequest/${selectedUser.id}`, {
            fromUser: user.id.toString(),
            toUser: selectedUser.id.toString(),
        }, {})
        setUsers(prevState => prevState && prevState.filter(x => x.id !== selectedUser.id))

        setIsModalOpen(false)
    }

    return (
        <div className="h-100">
            <div className="">
                <DelayedInput
                    placeholder={'Введите логин для поиска'}
                    onChange={onSearch}
                    timeoutValue={1000}
                    loading={loading}
                />
            </div>
            <div className="h-100">
                {contacts && Object.values(contacts).length > 0 && (
                    <>
                        <Divider>Контакты</Divider>
                        {Object
                            .values(contacts)
                            .flatMap((contact) => <Contact key={contact.id} contact={contact}/>)}
                    </>
                )}
                {user && Object.values(contactRequests).filter(cr => !cr.cancelled && !cr.approved).length > 0 && (
                    <>
                        <Divider>Запросы</Divider>
                        {user && Object.values(contactRequests).flatMap(contact => (
                            !contact.cancelled
                            && !contact.approved
                            && <ContactRequest user={user} request={contact} key={contact.id} />
                        ))}
                    </>
                )}

                {users && users.length > 0 && !loading && (
                    <>
                        <Divider>Глобальный поиск</Divider>
                        {users.map(user => (
                            <UserProfile
                                onClick={() => selectUser(user)}
                                className={"hover-scale mb-1 border-0"}
                                user={user}
                                key={user.id}
                            />
                        ))}
                    </>
                )}
                {users && users.length === 0 && (
                    <>
                        <Divider/>
                        <p className='text-center'>По вашему запросу ничего не найдено</p>
                    </>
                )}
                {loading && (
                    <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/>
                )}
            </div>
            <Modal
                title="Информация"
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Flex className="w-100" align={"center"} gap={"small"}>
                    <p className="text-secondary mb-0">Логин пользователя:</p>
                    <Flex className="border-0 p-1 rounded shadow-sm" align={'center'} gap={2}>
                        {selectedUser && (
                            <>
                                <Avatar
                                    shape="square"
                                    size={'small'}
                                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${selectedUser?.username}`}
                                />
                                <p className='text-primary mb-0'>@{selectedUser?.username}</p>
                            </>
                        )}
                    </Flex>
                </Flex>
                <Flex className="mt-2" align={"center"} gap={"small"}>
                    {selectedUser && !selectedUser.online && (
                        <>
                            <span className="text-secondary">Заходил последний раз:</span>
                            {selectedUser?.lastSeen
                                ? <span>{dayjs(selectedUser?.lastSeen).format('HH:mm')}</span>
                                : <span>Еще не заходил</span>}
                        </>
                    )}
                    {selectedUser && selectedUser.online && (
                        <>
                            <span className="text-secondary">Заходил последний раз:</span>
                            <span className="text-success">Онлайн</span>
                        </>
                    )}
                </Flex>
                <Button onClick={() => sendRequest()} type="primary" className="mt-2 w-100">
                    Отправить запрос в контакты!
                </Button>
            </Modal>
        </div>
    );
};

export default UsersSearch;
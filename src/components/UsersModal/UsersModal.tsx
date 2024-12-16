import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import {Avatar, Button, Checkbox, Divider, Flex, Modal} from "antd";
import {ContactType} from "../../types.ts";
import DelayedInput from "../DelayedInput/DelayedInput.tsx";

export type UsersModalProps = {
    open: boolean;
    onClose: () => void;
    onFinish: (contacts: ContactType[]) => void;
    chatUsers: number[]
}

const UsersModal = ({open, onClose, onFinish, chatUsers}: UsersModalProps): React.ReactElement => {
    const {contacts} = useSelector((state: RootState) => state.chat);
    const [selectedContacts, setSelectedContacts] = useState<ContactType[]>([]);
    const [availableContacts, setAvailableContacts] = useState<ContactType[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);

    useEffect(() => {
        setAvailableContacts(Object.values(contacts).filter(contact => !chatUsers.includes(contact.contact.id)).flat())
    }, [contacts, setAvailableContacts, chatUsers]);

    useEffect(() => {
        setFilteredContacts(availableContacts);
    }, [availableContacts, setFilteredContacts]);

    useEffect(() => {
        if (!open) {
            setSelectedContacts([])
        }
    }, [open]);

    const onFinishSelect = () => {
        if (onFinish) {
            onFinish(selectedContacts);
        }
    }

    return (
        <Modal
            title="Добавление пользователей в чат"
            open={open}
            onCancel={onClose}
            centered
            footer={null}
            forceRender
            destroyOnClose
        >
            <Flex gap="small" vertical>
                {availableContacts && availableContacts.length == 0 && (
                    <h6 className="text-secondary text-center mb-0">
                        В вашем списке контактов нет доступных
                        пользователей, чтобы добавить их в данный чат
                    </h6>
                )}
                {availableContacts && availableContacts.length > 0 && (
                    <>
                        <p className="mb-0">Поиск по контактам</p>
                        <DelayedInput timeoutValue={500} onChange={(value: string) => {
                            setFilteredContacts(availableContacts
                                .filter(contact => contact.contact.username.toLowerCase().includes(value.toLowerCase()))
                            )
                        }}/>
                        <Divider/>
                    </>
                )}
                {filteredContacts && filteredContacts.length == 0 && (
                    <h6 className="text-secondary text-center mb-0">
                        По вашему запросу ничего не найдено
                    </h6>
                )}
                {filteredContacts
                    && availableContacts
                    && availableContacts.length > 0
                    && filteredContacts.length > 0
                    && filteredContacts.map((contact) => (
                        <Flex key={contact.id} gap="small">
                        <Checkbox checked={selectedContacts.includes(contact)} onChange={() => {
                                setSelectedContacts(prevState => prevState.includes(contact)
                                    ? prevState.filter(x => x.id !== contact.id)
                                    : [...prevState, contact])
                            }}/>
                            <Flex
                                className={`border-0 rounded-2 shadow-sm w-100 p-2`}
                                align='center'
                                gap='small'
                                justify='space-between'
                            >
                                <div>
                                    <Avatar
                                        size="small"
                                        shape="square"
                                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${contact.contact.username}`}
                                    />
                                    <small className="ms-1 text-primary"><b>@</b>{contact.contact.username}</small>
                                </div>
                            </Flex>
                        </Flex>
                    ))}
            </Flex>
            <Divider/>
            <Button className="w-100" onClick={() => onFinishSelect()} disabled={selectedContacts.length === 0}>
                Добавить {selectedContacts.length} пользователя/ей
            </Button>
        </Modal>
    );
};

export default UsersModal;
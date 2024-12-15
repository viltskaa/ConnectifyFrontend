import React from 'react';
import {ContactType} from "../../types.ts";
import {Avatar, Button, Flex} from "antd";

export type ContactProps = {
    contact: ContactType
    onClick?: (contact: ContactType) => void
    onDelete?: (contact: ContactType) => void
    className?: string
}

const Contact = ({contact, onClick, onDelete, className}: ContactProps): React.ReactElement => {
    return (
        <Flex
            onClick={() => onClick && onClick(contact)}
            className={`border-0 rounded-2 shadow-sm w-100 p-2 ${className}`}
            align='center'
            gap='small'
            justify='space-between'
        >
            <div>
                <Avatar
                    shape="square"
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${contact.contact.username}`}
                />
                <small className="ms-1 text-primary"><b>@</b>{contact.contact.username}</small>
            </div>
            <Button onClick={() => onDelete && onDelete(contact)} size='small' danger type='link'>
                <small>Удалить</small>
            </Button>
        </Flex>
    );
};

export default Contact;
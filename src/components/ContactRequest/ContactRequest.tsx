import React from 'react';
import {ContactRequestType, UserType} from "../../types.ts";
import {Avatar, Button, Flex, Tooltip} from "antd";
import "./ContactRequest.css"
import {useStomp} from "../../hooks/useStomp.ts";

type ContactRequestProps = {
    request: ContactRequestType,
    user: UserType
}

type RequestStatus = {
    label: string,
    icon: string,
    className: string,
}

const ContactRequest = ({request, user}: ContactRequestProps): React.ReactElement => {
    const {send, active} = useStomp()

    const returnStatus = (approved: boolean, canceled: boolean): RequestStatus => {
        console.log(request)

        if (approved && !canceled) {
            return {
                //<span className="text-success">Принят</span>
                label: "Принят",
                icon: "bi bi-check",
                className: "text-success",
            }
        } else if (canceled && !approved) {
            return {
                //<span className="text-danger">Отклонен</span>
                label: "Отклонен",
                icon: "bi bi-x",
                className: "text-danger",
            }
        }
        return {
            label: "В процессе",
            icon: "bi bi-hourglass",
            className: "text-info flipper",
        }
    }

    const tooltipWrapper = (approved: boolean, canceled: boolean) => {
        const data = returnStatus(approved, canceled);

        return <Tooltip title={data.label}>
            <Button type="link" size="small" icon={<i className={`${data.icon} ${data.className} fs-6`}/>}/>
        </Tooltip>
    }

    const approveRequest = () => {
        if (!active) return;

        send(`/app/approveRequest/${request.toUser.id}`, {
            requestId: request.id.toString()
        }, {})
    }

    const cancelRequest = () => {
        if (!active) return;

        send(`/app/cancelRequest/${request.toUser.id}`, {
            requestId: request.id.toString()
        }, {})
    }

    return (
        <Flex justify="space-between" align="center" className="border-0 rounded p-2 shadow-sm mb-2">
            <Flex align="center">
                <Avatar
                    shape="square"
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                        request && request.toUser.id === user.id ? request.fromUser.username : request.toUser.username
                    }`}
                />
                <small className="ms-1 text-primary">@{
                    request && request.toUser.id === user.id ? request.fromUser.username : request.toUser.username
                }</small>
            </Flex>
            <div className="">
                {tooltipWrapper(request.approved, request.cancelled)}
                {request && !request.approved && (
                    <>
                        {request && request.toUser.id === user.id
                            ? (
                                <Tooltip title="Принять">
                                    <Button
                                        onClick={() => approveRequest()}
                                        size='small'
                                        type='primary'
                                        className="ms-2"
                                        icon={<i className="bi bi-check"/>}/>
                                </Tooltip>
                            )
                            : (
                                <Tooltip title="Отменить">
                                    <Button
                                        onClick={() => cancelRequest()}
                                        size='small'
                                        type='dashed'
                                        className="ms-2"
                                        icon={<i className="bi bi-trash"/>}/>
                                </Tooltip>
                            )
                        }
                    </>
                )}
            </div>
        </Flex>
    );
};

export default ContactRequest;
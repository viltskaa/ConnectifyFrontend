import React, {useContext, useEffect, useState} from 'react';
import {Button, Divider, Flex, message, Modal, Spin} from "antd";
import HighlightAtWords from "../HighlightAtWords/HighlightAtWords.tsx";
import { LoadingOutlined } from '@ant-design/icons';
import requests from "../../api/AiRequests.ts";
import {UserContext} from "../../main.tsx";
import "./AiHelpModal.css"

type AiHelpModalProps = {
    open: boolean;
    onClose: () => void;
    messageToExplain: string;
}

const AiHelpModal = ({open, onClose, messageToExplain}: AiHelpModalProps): React.ReactElement => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [response, setResponse] = useState<string>();
    const [reload, setReload] = useState<boolean>(false);
    const [reloadCount, setReloadCount] = useState<number>(0);
    const {user} = useContext(UserContext)

    const {getAiRequestData} = requests

    useEffect(() => {
        setReloadCount(0)
    }, [messageToExplain]);

    useEffect(() => {
        if (!user) return;

        const getResponse = async () => {
            setLoading(true);
            const data = await getAiRequestData({text: messageToExplain}, user.jwt);

            if (typeof data === 'string') {
                setResponse(data)
                setLoading(false);
                setReloadCount(prev => prev + 1)
            }
        }

        getResponse().catch(() => setError(true));
    }, [getAiRequestData, messageToExplain, user, reload])

    const onCopy = () => {
        if (!response) return;

        navigator.clipboard
            .writeText(response)
            .then(() => message.success("Успешно копирование"))
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            destroyOnClose
            footer={null}
            centered
            title={<h3><i className="bi bi-stars text-primary"></i> AI Помощь</h3>}
        >
            <Flex gap="small" vertical>
                <div className="border-0 shadow-sm p-2 rounded-1">
                    <small className="text-secondary">Сообщение:</small>
                    <HighlightAtWords
                        text={messageToExplain}
                        className="mb-0 pre-wrap"
                    />
                </div>
                <div className="border-0 shadow-sm p-2 rounded-1 position-relative">
                    <Flex className="position-absolute top-0 end-0 m-2">
                        <Button
                            size="small"
                            icon={<i className="bi bi-copy"/>}
                            onClick={() => onCopy()}
                            type="link"
                            disabled={loading}
                        />
                        <Button
                            size="small"
                            icon={<i className="bi bi-arrow-clockwise"/>}
                            onClick={() => setReload(prev => !prev)}
                            type="link"
                            disabled={loading || reloadCount === 3}
                        />
                    </Flex>
                    <small className="text-secondary position-absolute bottom-0 end-0 badge m-2 fw-light">
                        {reloadCount}/3
                    </small>
                    <small className="text-secondary">Объяснение:</small>
                    {loading && !error && (
                        <Flex className="w-100" align='center' justify="center">
                            <Spin indicator={<LoadingOutlined spin />} size="large" />
                        </Flex>
                    )}
                    {!loading && !error && response && (
                        <HighlightAtWords
                            text={response}
                            className="mb-0 pre-wrap mt-1"
                        />
                    )}
                    {error && (
                        <p className="text-danger mb-0">Произошла ошибка, попробуйте позже</p>
                    )}
                </div>
                <Divider/>
                <small className="text-secondary">
                    Обратите внимание: нейронная сеть может допускать ошибки в анализе данных.
                    Мы рекомендуем проверять результаты перед их использованием.
                </small>
            </Flex>
        </Modal>
    );
};

export default AiHelpModal;
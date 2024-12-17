import React, {ChangeEvent, useContext, useState} from 'react';
import {Button, Divider, Flex, Modal, Spin} from "antd";
import HighlightAtWords from "../HighlightAtWords/HighlightAtWords.tsx";
import {LoadingOutlined} from "@ant-design/icons";
import {UserContext} from "../../main.tsx";
import requests from "../../api/AiRequests.ts";
import TextArea from "antd/es/input/TextArea";


type AiMessageHelpProps = {
    open: boolean;
    onClose: () => void;
    userMessage?: string;
    onSelect: (message: string) => void;
}


const AiMessageHelp = ({onClose, open, userMessage, onSelect}: AiMessageHelpProps): React.ReactElement => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [promt, setPromt] = useState<string>("");
    const [response, setResponse] = useState<string>();
    const [reloadCount, setReloadCount] = useState<number>(0);
    const {user} = useContext(UserContext)

    const {getAiDirectRequestData} = requests

    const onSend = () => {
        if (!user || !promt) return;

        setLoading(true);
        setError(false);
        setReloadCount(prev => prev + 1);
        getAiDirectRequestData({text: promt}, user.jwt)
            .then((response) => {
                if (typeof response === "string") {
                    setResponse(response);
                }
            }).catch(() => setError(true)).finally(() => setLoading(false));
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
                    <small className="text-secondary">Промт:</small>
                    <TextArea
                        autoFocus
                        autoSize
                        autoComplete="on"
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                            setPromt(event.target.value)
                        }}
                        defaultValue={
                            userMessage
                                ? `Улучши мое сообщение: ${userMessage}`
                                : "Сгенерируй мне сообщение со следующим смыслом"
                        }
                    />
                    <Button
                        disabled={loading || reloadCount >= 3}
                        className={"mt-2 w-100"}
                        onClick={onSend}
                        type="primary"
                        size="small"
                    >
                        Отправить
                    </Button>
                </div>
                <div className="border-0 shadow-sm p-2 rounded-1 position-relative">
                    <small className="text-secondary">
                        Ответ <small className="text-secondary fw-light">{reloadCount}/3</small>:
                    </small>
                    {loading && !error && (
                        <Flex className="w-100" align='center' justify="center">
                            <Spin indicator={<LoadingOutlined spin/>} size="large"/>
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
                    <Button
                        className="mt-2 w-100"
                        size="small"
                        icon={<i className="bi bi-check2"/>}
                        onClick={() => response && onSelect(response)}
                        disabled={!response}
                    >
                        Выбрать
                    </Button>
                </div>
                <Divider/>
                <small className="text-secondary">
                    Обратите внимание: нейронная сеть может допускать ошибки в генерации данных.
                    Мы рекомендуем проверять результаты перед их использованием.
                </small>
            </Flex>
        </Modal>
    );
};

export default AiMessageHelp;
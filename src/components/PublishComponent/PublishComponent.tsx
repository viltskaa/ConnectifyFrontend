import React, {useEffect, useState} from 'react';
import {Button, Flex, Mentions} from "antd";
import {useLegacyFocus} from "../../hooks/useLegacyFocus.ts";
import {UserType} from "../../types.ts";
import AiMessageHelp from "../AiMessageHelp/AiMessageHelp.tsx";

export type PublishComponentProps = {
    onPublish?: (message: string) => void;
    focused?: boolean;
    users: UserType[]
}

const PublishComponent = ({onPublish, focused, users}: PublishComponentProps): React.ReactElement => {
    const [text, setText] = useState<string>("")
    const [aiHelpModal, setAiHelpModal] = useState<boolean>(false);
    const {ref, setFocus} = useLegacyFocus()

    const onEnterText = (value: string) => {
        setText(value)
    }

    const onClickEnter = () => {
        if (onPublish) {
            onPublish(text)
        }
        setText("")
    }

    useEffect(() => {
        if (focused) {
            setFocus()
        }
    }, [focused, setFocus])

    return (
        <Flex gap={'small'}>
            <Mentions
                autoFocus
                ref={ref}
                value={text}
                onChange={onEnterText}
                placeholder="Message"
                autoSize
                options={users.map(user => ({label: user.username, value: user.username}))}
            />
            <Button disabled={text.length <= 0} onClick={() => onClickEnter()} type="primary">Отправить</Button>
            <Button
                onClick={() => setAiHelpModal(true)}
                icon={<i className="bi bi-stars text-primary"/>}
                value={"AI"}
            >
                AI
            </Button>
            <AiMessageHelp
                open={aiHelpModal}
                onClose={() => setAiHelpModal(false)}
                userMessage={text}
                onSelect={(value: string) => {
                    setAiHelpModal(false)
                    setText(value)
                }}
            />
        </Flex>
    );
};

export default PublishComponent;
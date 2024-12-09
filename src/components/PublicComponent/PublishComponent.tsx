import React, {ChangeEvent, useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import {Button, Flex} from "antd";

export type PublishComponentProps = {
    onPublish?: (message: string) => void;
}

const PublishComponent = ({onPublish}: PublishComponentProps): React.ReactElement => {
    const [text, setText] = useState<string>("")

    const onEnterText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const onClickEnter = () => {
        if (onPublish) {
            onPublish(text)
        }
        setText("")
    }

    return (
        <Flex gap={'small'}>
            <TextArea value={text} onChange={onEnterText} placeholder="Message" autoSize/>
            <Button onClick={() => onClickEnter()} type="primary">Send</Button>
        </Flex>
    );
};

export default PublishComponent;
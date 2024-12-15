import React, {ChangeEvent, useEffect, useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import {Button, Flex} from "antd";
import {useFocus} from "../../hooks/useFocus.ts";

export type PublishComponentProps = {
    onPublish?: (message: string) => void;
    focused?: boolean;
}

const PublishComponent = ({onPublish, focused}: PublishComponentProps): React.ReactElement => {
    const [text, setText] = useState<string>("")
    const {ref, setFocus} = useFocus<HTMLTextAreaElement>()

    const onEnterText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
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
            <TextArea autoFocus ref={ref} value={text} onChange={onEnterText} placeholder="Message" autoSize/>
            <Button disabled={text.length <= 0} onClick={() => onClickEnter()} type="primary">Send</Button>
        </Flex>
    );
};

export default PublishComponent;
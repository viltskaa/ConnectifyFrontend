import React from 'react';
import {Modal} from "antd";

type MessageFinderProps = {
    open: boolean;
    onClose: () => void;
}

const MessageFinder = ({open, onClose}: MessageFinderProps): React.ReactElement => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
        >

        </Modal>
    );
};

export default MessageFinder;
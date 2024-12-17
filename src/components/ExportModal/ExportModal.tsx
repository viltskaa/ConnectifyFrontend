import React, {useContext, useRef, useState} from 'react';
import {Button, Flex, Modal} from "antd";
import requests from "../../api/ExportApi.ts";
import {UserContext} from "../../main.tsx";

type ExportModalProps = {
    open: boolean;
    onClose: () => void;
    chatId: number;
}

const ExportModal = ({open, onClose, chatId}: ExportModalProps): React.ReactElement => {
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLAnchorElement>(null);
    const {user} = useContext(UserContext);

    const {getCsv, getPdf, getExcel} = requests

    const csv = () => {
        if (!ref.current || !user) return
        setLoading(true);
        getCsv({chatId}, user.jwt)
            .then((data) => {
                const blob = data as Blob;

                const link = ref.current;
                if (!link) return;

                link.href = window.URL.createObjectURL(blob);
                link.download = `exported_data.csv`;
                link.click();
                setLoading(false);
            })
    }

    const excel = () => {
        if (!ref.current || !user) return
        setLoading(true);
        getExcel({chatId}, user.jwt)
            .then((data) => {
                const blob = data as Blob;

                const link = ref.current;
                if (!link) return;

                link.href = window.URL.createObjectURL(blob);
                link.download = `exported_data.xlsx`;
                link.click();
                setLoading(false);
            })
    }

    const pdf = () => {
        if (!ref.current || !user) return
        setLoading(true);
        getPdf({chatId}, user.jwt)
            .then((data) => {
                const blob = data as Blob;

                const link = ref.current;
                if (!link) return;

                link.href = window.URL.createObjectURL(blob);
                link.download = `exported_data.pdf`;
                link.click();
                setLoading(false);
            })
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            destroyOnClose
            footer={null}
            centered
            title={<h3><i className="bi bi-file-earmark-arrow-up text-primary"/> Экспорт чата</h3>}
        >
            <small className="text-secondary mb-2">Выберите формат файла для скачивания истории чата</small>
            <Flex gap="small">
                <Button loading={loading} className="w-100" onClick={csv}>.csv</Button>
                <Button loading={loading} className="w-100" onClick={pdf}>.pdf</Button>
                <Button loading={loading} className="w-100" onClick={excel}>.xlsx</Button>
            </Flex>
            <a ref={ref} href="" className="d-none"></a>
        </Modal>
    );
};

export default ExportModal;
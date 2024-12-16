import React, {useEffect, useState} from 'react';
import {ChatType} from "../../types.ts";
import {
    Avatar,
    Button,
    ColorPicker,
    Divider,
    Flex,
    Form,
    FormProps,
    Input,
    message,
    Modal,
    Select,
    Space
} from "antd";
import {icons} from "../../icons/icons.ts";
import {useStomp} from "../../hooks/useStomp.ts";

type ChatUpdateProps = {
    open: boolean;
    onClose: () => void;
    chat: ChatType;
}

type ChatUpdateType = {
    name: string,
    icon: string,
    color: string,
}

const ChatUpdateModal = ({open, onClose, chat}: ChatUpdateProps): React.ReactElement => {
    const [form] = Form.useForm<ChatUpdateType>();
    const {send, active} = useStomp()
    const [canUpdate, setCanUpdate] = useState<boolean>(true)

    useEffect(() => {
        form.setFieldsValue({
            name: chat.chatName,
            color: chat.color,
            icon: chat.icon,
        })
    }, [chat, form])

    const onFinish: FormProps<ChatUpdateType>['onFinish'] = (values) => {
        if (chat.id && active) {
            send(`/app/updateChat/${chat.id}`, {...values,}, {})
            onClose();
            form.resetFields()
            message.success(`Чат ${values.name} успешно изменен!`)
        }
    };

    const onValuesChange = (_: unknown, values: ChatUpdateType) => {
        setCanUpdate(JSON.stringify(values) == JSON.stringify({
            name: chat.chatName,
            color: chat.color,
            icon: chat.icon,
        }))
    }

    return (
        <Modal
            title={<h2>Изменение чата</h2>}
            centered
            open={open}
            onCancel={() => onClose()}
            footer={null}
            forceRender
            destroyOnClose
        >
            <Form
                form={form}
                name="chat"
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={onValuesChange}
                autoComplete="off"
            >
                <Form.Item<ChatUpdateType>
                    label="Название чата"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input chat name!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Flex>
                    <Form.Item<ChatUpdateType>
                        label="Цвет"
                        name="color"
                        className="w-25"
                        rules={[
                            {
                                required: true,
                                message: 'Please select chat color!',
                            },
                        ]}
                        getValueProps={(value) => ({value: value})}
                        normalize={(value) => value && `${value.toHexString()}`}
                    >
                        <ColorPicker/>
                    </Form.Item>

                    <Form.Item<ChatUpdateType>
                        label="Иконка чата"
                        name="icon"
                        className="w-100"
                        rules={[
                            {
                                required: true,
                                message: 'Please select chat icon!',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            className='w-100'
                            placeholder="Search to Select"
                            optionFilterProp="label"
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={icons.map((value) => ({value: value.className, label: value.name}))}
                            optionRender={(option) => (
                                <Space>
                                    <i className={option.data.value}></i>
                                    {option.data.label}
                                </Space>
                            )}
                        />
                    </Form.Item>
                </Flex>

                <Divider>Предпоказ</Divider>
                <Form.Item<ChatUpdateType> dependencies={['name', 'color', 'icon']}>
                    {() => (
                        <Flex align='center' gap={"small"}>
                            <Avatar
                                style={{
                                    color: form.getFieldValue('color'),
                                    backgroundColor: "#ffffff00",
                                }}
                                className="border-0 shadow-sm"
                                shape="square"
                                icon={(<i className={form.getFieldValue('icon') || "bi bi-chat-left"}></i>)}
                            />
                            <Flex vertical>
                                <span className="text-truncate mb-0 fw-bold">{form.getFieldValue('name')}</span>
                                <small className='text-secondary'>Сообщений пока нет</small>
                            </Flex>
                        </Flex>
                    )}
                </Form.Item>

                <Form.Item className="w-100 mb-0" label={null}>
                    <Button disabled={canUpdate} type="primary" className="w-100" htmlType="submit">
                        Изменить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChatUpdateModal;
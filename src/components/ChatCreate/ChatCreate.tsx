import React, {useContext, useState} from 'react';
import {Avatar, Button, ColorPicker, Divider, Flex, Form, FormProps, Input, Modal, Progress, Select, Space} from "antd";
import {ChatCreateType} from "../../types.ts";
import {icons} from "../../icons/icons.ts";
import {useStomp} from "../../hooks/useStomp.ts";
import {UserContext} from "../../main.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";

type ChatCreateProps = {
    open: boolean;
    onClose: () => void;
}

const ChatCreate = ({open, onClose}: ChatCreateProps): React.ReactElement => {
    const [form] = Form.useForm();
    const {send, active} = useStomp()
    const {user} = useContext(UserContext)
    const {contacts} = useSelector((state: RootState) => state.chat);
    const [percents, setPercents] = useState<number>(0)

    const onFinish: FormProps<ChatCreateType>['onFinish'] = (values) => {
        if (user && user.id && active) {
            send(`/app/createChat/${user.id}`, {
                ...values,
                users: values.users.toString(),
                ownerId: user.id.toString()
            }, {})
            onClose();
        }
    };

    const onValuesChange = (_: unknown, values: ChatCreateType) => {
        setPercents(() => (4 - Object.values(values).filter(x => !x).length) * 25)
    }

    return (
        <Modal
            title={<h2>Создание чата</h2>}
            centered
            open={open}
            onCancel={() => onClose()}
            footer={null}>
            <Form
                form={form}
                name="chat"
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={onValuesChange}
                autoComplete="off"
            >
                <Form.Item<ChatCreateType>
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
                    <Form.Item<ChatCreateType>
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

                    <Form.Item<ChatCreateType>
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
                <Form.Item<ChatCreateType> dependencies={['name', 'color', 'icon']}>
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

                <Divider>Пользователи чата</Divider>
                <Form.Item<ChatCreateType>
                    name="users"
                    rules={[
                        {
                            required: true,
                            message: 'Please select users!',
                        }
                    ]}
                >
                    <Select
                        mode="multiple"
                        options={Object.values(contacts).flatMap(contact => ({
                            label: contact.contact.username,
                            value: contact.contact.id
                        }))}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        showSearch
                    />
                </Form.Item>

                <Divider>Процесс создания чата</Divider>
                <Progress className="mb-2" percent={percents} status="active"/>

                <Form.Item className="w-100 mb-0" label={null}>
                    <Button disabled={percents !== 100} type="primary" className="w-100" htmlType="submit">
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChatCreate;
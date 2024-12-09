import React from 'react';
import {Button, Form, FormProps, Input} from "antd";

type AuthType = {
    username?: string;
    password?: string;
};

type AuthFormProps = {
    onSubmit?: (data: AuthType) => void;
}

const AuthForm = ({onSubmit}: AuthFormProps): React.ReactElement => {
    const onFinish: FormProps<AuthType>['onFinish'] = (values) => onSubmit && onSubmit(values);

    return (
        <Form
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <Form.Item<AuthType>
                label="Логин"
                name="username"
                rules={[
                    {required: true, message: 'Please input your username!'},
                    {min: 3, message: 'Please input your username!'},
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item<AuthType>
                label="Пароль"
                name="password"
                rules={[
                    {required: true, message: 'Please input your password!'},
                    {min: 3, message: 'Please input your password!'},
                ]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item className="w-100 mb-0">
                <Button className="w-100" type="primary" htmlType="submit">
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AuthForm;
import React from 'react';
import {Button, Form, FormProps, Input} from "antd";

export type SignInFormType = {
    username: string;
    password: string;
};

type SignInFormProps = {
    onSubmit?: (data: SignInFormType) => void;
    className?: string;
    loading?: boolean;
}

const SignInForm = ({onSubmit, className, loading = false}: SignInFormProps): React.ReactElement => {
    const onFinish: FormProps<SignInFormType>['onFinish'] = (values) => onSubmit && onSubmit(values);

    return (
        <Form
            disabled={loading}
            className={className}
            name="signIn"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <Form.Item<SignInFormType>
                label="Логин"
                name="username"
                rules={[
                    {required: true, message: 'Please input your username!'},
                    {min: 3, message: 'Please input your username!'},
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item<SignInFormType>
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

export default SignInForm;
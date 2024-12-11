import React, {useState} from 'react';
import {Button, Form, FormProps, Input} from "antd";
import { RuleObject } from 'antd/lib/form';
import requests from "../../api/AuthRequests.ts";

export type SignUpFormType = {
    username: string,
    password: string,
    confirmPassword: string,
    email: string,
}

type SignUpFormProps = {
    onSubmit: (data: SignUpFormType) => void;
    className?: string;
    loading?: boolean;
}

const SignUpForm = ({onSubmit, className, loading}: SignUpFormProps): React.ReactElement => {
    const onFinish: FormProps<SignUpFormType>['onFinish'] = (values) => onSubmit && onSubmit(values);
    const [usernameLoading, setUsernameLoading] = useState<boolean>(false);

    const {usernameExist} = requests

    const validateEmail = async (_: RuleObject, value: string) => {
        if (!value) {
            return Promise.reject(new Error('Введите email'));
        }
        // const { valid } = await validate(value);
        // if (!valid) {
        //     return Promise.reject(new Error('Введите корректный email'));
        // }
        return Promise.resolve();
    };

    const validateUsername = async (_: RuleObject, value: string) => {
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
            return Promise.reject(new Error('Имя пользователя может содержать только латинские символы'));
        }

        setUsernameLoading(true);
        const data = await usernameExist(value);
        if (data) {
            return Promise.reject(new Error('Данное имя занято'));
        }
        setUsernameLoading(false);

        return Promise.resolve();
    };

    const validatePasswordsMatch = ({ getFieldValue }: { getFieldValue: (value: string) => unknown }) => ({
        validator: (_: RuleObject, value: string)=> {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Пароли не совпадают'));
        },
    });

    return (
        <Form
            disabled={loading}
            className={className}
            name="signUp"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <Form.Item<SignUpFormType>
                label="Логин"
                name="username"
                rules={[
                    {required: true, message: 'Please input your username!'},
                    {min: 8, message: 'Please input your username!'},
                    {validator: validateUsername}
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item<SignUpFormType>
                label="Ваша почта"
                name="email"
                rules={[
                    {required: true, message: 'Please input your username!'},
                    {validator: validateEmail}
                ]}
            >
                <Input type="email"/>
            </Form.Item>

            <Form.Item<SignUpFormType>
                label="Пароль"
                name="password"
                rules={[
                    {required: true, message: 'Please input your password!'},
                    {min: 10, message: 'Please input your password!'},
                ]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item<SignUpFormType>
                label="Повторите пароль"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    {required: true, message: 'Please input your password!'},
                    {min: 10, message: 'Please input your password!'},
                    validatePasswordsMatch
                ]}
            >
                <Input.Password/>
            </Form.Item>


            <Form.Item className="w-100 mb-0">
                <Button disabled={usernameLoading} className="w-100" type="primary" htmlType="submit">
                    Регистрация
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SignUpForm;
import React, {useEffect, useState} from 'react';
import {Button} from "antd";
import SignInForm from "../AuthForm/SignInForm.tsx";
import SignUpForm, {SignUpFormType} from "../RegistrationForm/SignUpForm.tsx";

import './AuthComponent.css'
import requests from "../../api/AuthRequests.ts";
import {UserType} from "../../types.ts";

export type AuthComponentType = "SIGNIN" | "SIGNUP"

type AuthComponentProps = {
    onFinish: (user: UserType) => void;
    onChangeType?: (type: AuthComponentType) => void;
}

const AuthComponent = ({onFinish, onChangeType}: AuthComponentProps): React.ReactElement => {
    const [type, setType] = useState<AuthComponentType>("SIGNIN")
    const [loading, setLoading] = useState<boolean>(false)

    const {signIn, signUp} = requests

    useEffect(() => {
        if (onChangeType) {
            onChangeType(type)
        }
    }, [type, onChangeType]);

    const changeType = () => {
        if (type === "SIGNUP") {
            setType("SIGNIN")
        } else {
            setType("SIGNUP")
        }
    }

    const onSubmitSignIn = ({username, password}: { username: string, password: string }) => {
        if (!username || !password) return

        setLoading(true)

        const req = async () => {
            const user = await signIn(username, password)
            if (user && 'id' in user) {
                onFinish(user)
            }
        }

        req().then(() => setLoading(false))
    }

    const onSubmitSignUp = ({username, password, email}: SignUpFormType) => {
        if (!username || !password || !email) return

        setLoading(true)

        const req = async () => {
            const value = await signUp(username, password, email)
            if (typeof value === "string") {
                setType("SIGNIN")
            }
        }

        req().then(() => setLoading(false))
    }

    return (
        <>
            {type === "SIGNIN" && (<SignInForm loading={loading} onSubmit={onSubmitSignIn} className='fade-in'/>)}
            {type === "SIGNUP" && (<SignUpForm loading={loading} onSubmit={onSubmitSignUp} className='fade-in'/>)}
            <Button type='link' onClick={() => changeType()} className="w-100 mt-2">
                {type === "SIGNUP" && "Вход"}
                {type === "SIGNIN" && "Нет аккаунта?"}
            </Button>
        </>
    );
};

export default AuthComponent;
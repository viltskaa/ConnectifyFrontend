import React, {useEffect, useState} from 'react'
import './App.css'
import {Card, Flex} from "antd";
import {UserType} from "./types.ts";
import {UserContext, UserContextType} from "./main.tsx";
import AuthForm from "./components/AuthForm/AuthForm.tsx";
import requests from "./api/AuthRequests.ts";
import Chat from "./components/Chat/Chat.tsx";


const loadUserFromLocalStorage = (): UserType | null => {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user) as UserType
    }
    return null
}

const saveUserToLocalStorage = (user: UserType): void => localStorage.setItem('user', JSON.stringify(user))


const App = (): React.ReactElement => {
    const [user, setUser] = useState<UserType | null>(loadUserFromLocalStorage());
    const [userContext, setUserContext] = useState<UserContextType>();
    const [loading, setLoading] = useState<boolean>(false);

    const {signIn} = requests

    useEffect(() => {
        if (user === null) return

        setUserContext({
            username: user.username,
            jwt: user.jwt,
            setJwt: (jwt: string) => setUser(x => x && ({...x, jwt})),
            setUsername: (username: string) => setUser(x => x && ({...x, username}))
        })

        saveUserToLocalStorage(user)
    }, [user])

    const onSubmitAuth = ({username, password}: { username?: string, password?: string }) => {
        if (!username || !password) return

        setLoading(true)

        const req = async () => {
            const jwt = await signIn(username, password)
            if (jwt && typeof jwt === "string") {
                setUser(() => ({username, jwt,}))
            }
        }

        req().then(() => setLoading(false))
    }

    return (
        <>
            {userContext && user && (
                <UserContext.Provider value={userContext}>
                    <div className="h-100 p-4">
                        <Chat loading={loading} user={user} chatId={1}/>
                    </div>
                </UserContext.Provider>
            )}
            {!userContext && (
                <Flex className='h-100' align='center' justify='center' vertical>
                    <Card loading={loading} title={"Авторизация"} className="w-25">
                        <AuthForm onSubmit={onSubmitAuth}/>
                    </Card>
                </Flex>
            )}
        </>
    )
}

export default App

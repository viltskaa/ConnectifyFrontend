import React, {useEffect, useState} from 'react'
import './App.css'
import {Card, Flex} from "antd";
import {UserType} from "./types.ts";
import {UserContext, UserContextType} from "./main.tsx";
import requests from "./api/AuthRequests.ts";
import Layout from "./components/Layout/Layout.tsx";
import {StompConfig} from "@stomp/stompjs";
import {StompProvider} from "./providers/StompProvider.tsx";
import AuthComponent from "./components/AuthComponent/AuthComponent.tsx";
import {Provider} from "react-redux";
import store from "./store/store.ts";
import WebSocketClient from "./components/WebSocketClient/WebSocketClient.tsx";
import ChatWrapper from "./components/ChatWrapper/ChatWrapper.tsx";


const loadUserFromLocalStorage = (): UserType | null => {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user) as UserType
    }
    return null
}

const saveUserToLocalStorage = (user: UserType): void => localStorage.setItem('user', JSON.stringify(user))

const deleteUserFromLocalStorage = (): void => localStorage.removeItem('user');


const App = (): React.ReactElement => {
    const [user, setUser] = useState<UserType | null>(loadUserFromLocalStorage());
    const [userContext, setUserContext] = useState<UserContextType>();
    const [config, setConfig] = useState<StompConfig>({
        brokerURL: "ws://localhost:8080/chat",
        connectHeaders: {
            authorization: `Bearer ${user?.jwt}`,
        },
        disconnectHeaders: {
            authorization: `Bearer ${user?.jwt}`,
        }
    });

    const {verify} = requests

    const logout = () => {
        setUser(null)
        deleteUserFromLocalStorage()
    }

    useEffect(() => {
        if (user === null) return

        const checkJwt = async () => {
            const data = await verify(user.jwt)
            return typeof data === "boolean"
        }

        checkJwt()
            .then(data => {
                console.log(data)
                if (data) {
                    setUserContext({user, setUser, logout})
                    setConfig(prev => ({...prev, connectHeaders: {authorization: `Bearer ${user.jwt}`}}))
                    saveUserToLocalStorage(user)
                }
            })
    }, [user, verify])

    return (
        <>
            {userContext && user && (
                <StompProvider config={config}>
                    <UserContext.Provider value={userContext}>
                        <Provider store={store}>
                            <WebSocketClient/>
                            <Layout>
                                <ChatWrapper/>
                            </Layout>
                        </Provider>
                    </UserContext.Provider>
                </StompProvider>
            )}
            {!user && (
                <Flex className='h-100' align='center' justify='center' vertical>
                    <Card title={"Авторизация"} className="w-25">
                        <AuthComponent onFinish={setUser}/>
                    </Card>
                </Flex>
            )}
        </>
    )
}

export default App

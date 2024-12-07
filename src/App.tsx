import React, {useEffect, useState} from 'react'
import './App.css'
import {Button, Card, Divider, Flex} from "antd";
import Message from "./components/Message/Message.tsx";
import TextArea from "antd/es/input/TextArea";
import {User} from "./types.ts";
import {UserContext, UserContextType} from "./main.tsx";
import AuthForm from "./components/AuthForm/AuthForm.tsx";
import requests from "./api/AuthRequests.ts";

const loadUserFromLocalStorage = (): User | null => {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user) as User
    }
    return null
}

const App = (): React.ReactElement => {
    const [user, setUser] = useState<User | null>(loadUserFromLocalStorage());
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
    }, [user])

    const onSubmitAuth = ({username, password}: {username?: string, password?: string}) => {
        if (!username || !password) return

        setLoading(true)

        const req = async () => {
            const data = signIn(username, password).then()
            console.log(data)
        }
        req().then(() => setLoading(false))
    }

    return (
        <>
            {userContext && (
                <UserContext.Provider value={userContext}>
                    <Flex gap="small" className='h-100' justify='center' vertical>
                        <Card className="w-100 h-100">
                            <h4 className="mb-1">Chat name</h4>
                            <Divider/>
                            <Flex gap={"small"} vertical>
                                <Message message={"123456789009876543234567890"} variant={"left"} time={"11:90"}/>
                                <Message message={"11111"} variant={"right"} time={"11:90"}/>
                                <Message message={"11111"} variant={"left"} time={"11:90"}/>
                                <Message message={"11111"} variant={"left"} time={"11:90"}/>
                                <Message message={"11111"} variant={"left"} time={"11:90"}/>
                                <Message message={"11111"} variant={"left"} time={"11:90"}/>
                                <Message message={"11111"} variant={"left"} time={"11:90"}/>
                            </Flex>
                        </Card>
                        <Flex gap={'small'}>
                            <TextArea placeholder="Message" autoSize/>
                            <Button type="primary">Send</Button>
                        </Flex>
                    </Flex>
                </UserContext.Provider>
            )}
            {!userContext && (
                <Flex className='h-100' align='center' justify='center' vertical>
                    <Card loading={loading} title={"Авторизация"} className="w-25">
                        <AuthForm onSubmit={onSubmitAuth} />
                    </Card>
                </Flex>
            )}
        </>
    )
}

export default App

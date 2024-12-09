import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {StompProvider} from "./providers/Provider.tsx";
import {StompConfig} from "@stomp/stompjs";

export type UserContextType = {
    username?: string,
    jwt?: string,
    setUsername: (username: string) => void,
    setJwt: (jwt: string) => void,
}

export const UserContext = React.createContext<UserContextType>({
    username: undefined,
    jwt: undefined,
    setUsername: (username: string) => console.log(username),
    setJwt: (jwt: string) => console.log(jwt),
})

const stompConfig: StompConfig = {brokerURL: "ws://localhost:8080/chat"}

createRoot(document.getElementById('root')!).render(
  <StompProvider config={stompConfig}>
    <App />
  </StompProvider>,
)

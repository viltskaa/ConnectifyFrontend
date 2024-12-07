import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

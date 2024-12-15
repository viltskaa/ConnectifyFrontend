import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {UserType} from "./types.ts";

export type UserContextType = {
    user?: UserType,
    setUser: (user: UserType) => void
    logout: () => void
}

export const UserContext = React.createContext<UserContextType>({
    user: undefined,
    setUser: (user: UserType) => console.log(user),
    logout: () => {}
})

createRoot(document.getElementById('root')!).render(<App/>,)

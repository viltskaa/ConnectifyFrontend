import {get, post} from "./BaseRequest.ts";
import {UserType} from "../types.ts";

const host = import.meta.env.VITE_BACKEND_HOST + "/auth"

type SignInData = { username: string, password: string }
type SignUpData = { username: string, password: string, email: string }

const requests = {
    signIn: (username: string, password: string) => post<SignInData, UserType>(`${host}/signIn`, {
        username,
        password
    }),
    signUp: (username: string, password: string, email: string) => post<SignUpData, string>(`${host}/signUp`, {
        username,
        password,
        email
    }),
    verify: (token: string) => get<null, boolean>(`${host}/verify`, undefined, token),
    usernameExist: (username: string) => get<{username: string}, boolean>(`${host}/exist`, {username})
}

export default requests;
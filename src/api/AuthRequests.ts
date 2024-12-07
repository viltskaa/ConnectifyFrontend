import {post} from "./BaseRequest.ts";

const host = import.meta.env.VITE_BACKEND_HOST + "/auth"

type SignInData = { username: string, password: string }

const requests = {
    signIn: (username: string, password: string) => post<SignInData, string>(`${host}/signIn`, {
        username,
        password
    }),
    signUp: (username: string, password: string) => post<SignInData, string>(`${host}/signUp`, {
        username,
        password
    })
}

export default requests;
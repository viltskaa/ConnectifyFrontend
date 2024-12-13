import {get} from "./BaseRequest.ts";
import {UserType} from "../types.ts";

const host = import.meta.env.VITE_BACKEND_HOST + "/users"

export type SearchParams = {
    username: string;
}

const requests = {
    search: (query: string, jwt: string) =>
        get<SearchParams, UserType[]>(host, {username: query}, jwt)
}

export default requests;
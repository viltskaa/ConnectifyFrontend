import {post} from "./BaseRequest.ts";

const host = import.meta.env.VITE_BACKEND_HOST + "/ai"

type AiRequestData = { text: string };

const requests = {
    getAiRequestData: (data: AiRequestData, jwt: string) =>
        post<AiRequestData, string>(`${host}/get`, data, null, jwt),
}

export default requests;
import {get} from "./BaseRequest.ts";

const host = import.meta.env.VITE_BACKEND_HOST + "/export"

type ExportRequestsData = { chatId: number };

const requests = {
    getCsv: (data: ExportRequestsData, jwt: string) =>
        get<ExportRequestsData, Blob>(`${host}/csv`, data, jwt, "blob"),
    getPdf: (data: ExportRequestsData, jwt: string) =>
        get<ExportRequestsData, Blob>(`${host}/pdf`, data, jwt, "blob"),
    getExcel: (data: ExportRequestsData, jwt: string) =>
        get<ExportRequestsData, Blob>(`${host}/excel`, data, jwt, "blob"),
}

export default requests;
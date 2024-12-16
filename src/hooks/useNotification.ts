import {useContext} from "react";
import {NotificationProviderContext} from "../providers/NotificationProvider.tsx";

export const useNotification = () => {
    const {openNotification} = useContext(NotificationProviderContext);
    return openNotification;
}
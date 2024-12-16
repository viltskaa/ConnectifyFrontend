import React, {createContext, ReactNode} from 'react';
import {notification} from "antd";
import {ArgsProps} from "antd/es/notification";

export interface NotificationProviderContextType {
    openNotification: (props: ArgsProps) => void;
}

const defaultValue: NotificationProviderContextType = {
    openNotification: (props: ArgsProps) => console.log(props),
}

export const NotificationProviderContext = createContext<NotificationProviderContextType>(defaultValue);

interface NotificationProviderProps {
    children: ReactNode;
}

const NotificationProvider = ({children}: NotificationProviderProps): React.ReactElement => {
    const [api, context] = notification.useNotification({
        stack: {
            threshold: 3
        }
    });

    return (
        <NotificationProviderContext.Provider value={{
            openNotification: (props: ArgsProps) => api.success(props),
        }}>
            {context}
            {children}
        </NotificationProviderContext.Provider>
    );
};

export default NotificationProvider;
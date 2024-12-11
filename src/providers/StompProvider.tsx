import {createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Client, StompConfig, StompSubscription} from "@stomp/stompjs";

export interface Subscriptions {
    [key: string]: StompSubscription
}

export interface StompContextState {
    stompClient?: Client;
    subscriptions:Subscriptions
    setSubscriptions:Dispatch<SetStateAction<Subscriptions>>;
    active: boolean;
}

const defaultValue: StompContextState = {
    stompClient: undefined,
    subscriptions:{},
    setSubscriptions:()=>{},
    active: false,
}

export const StompContext = createContext<StompContextState>(defaultValue)

interface Props {
    children: ReactNode;
    config:StompConfig;
    onConnected?:(client:Client)=>void;
}

export const StompProvider:FC<Props> = ({children,config,onConnected})=>{
    const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
    const [active, setActive] = useState<boolean>(false);
    const [subscriptions, setSubscriptions] = useState({});

    useEffect(() => {
        if (config && config.connectHeaders && config.connectHeaders.authorization) {
            setStompClient(()=> new Client(config))
        }
    }, [config]);

    useEffect(() => {
        if (!stompClient) return

        stompClient.onConnect = () => setActive(true)
        stompClient?.activate();
        onConnected?.(stompClient)
        return ()=>{
            stompClient?.deactivate();
        }
    }, [onConnected, stompClient]);

    return (
        <StompContext.Provider value={{
            stompClient,
            subscriptions,
            setSubscriptions,
            active
        }}>
            {children}
        </StompContext.Provider>
    )
}
import {createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Client, StompConfig, StompSubscription} from "@stomp/stompjs";

export interface Subscriptions {
    [key: string]: StompSubscription
}

export interface StompContextState {
    stompClient: Client | null;
    subscriptions:Subscriptions
    setSubscriptions:Dispatch<SetStateAction<Subscriptions>>;
    active: boolean;
}

const defaultValue: StompContextState = {
    stompClient:null,
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
    const [stompClient] = useState(()=> new Client(config));
    const [active, setActive] = useState<boolean>(false);
    const [subscriptions, setSubscriptions] = useState({});

    useEffect(() => {
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
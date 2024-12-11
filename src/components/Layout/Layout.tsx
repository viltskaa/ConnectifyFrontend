import React from 'react';
import {Divider, Flex} from "antd";
import './Layout.css'
import ChatList from "../ChatList/ChatList.tsx";
import UserProfile from "../UserProfile/UserProfile.tsx";

export type LayoutProps = {
    children: React.ReactElement | React.ReactElement[] | string[] | string;
}

const Layout = ({children}: LayoutProps) => {
    return (
        <Flex className="h-100">
            <div style={{maxWidth: "25%"}} className="h-100 p-4 ps-4 pe-0 w-25">
                <Flex className="h-100" vertical>
                    <ChatList/>
                    <Divider/>
                    <UserProfile/>
                </Flex>
            </div>
            {children}
        </Flex>
    );
};

export default Layout;
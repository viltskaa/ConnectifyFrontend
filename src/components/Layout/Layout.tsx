import React, {useContext} from 'react';
import {Divider, Flex} from "antd";
import './Layout.css'
import ChatList from "../ChatList/ChatList.tsx";
import UserProfile from "../UserProfile/UserProfile.tsx";
import {UserContext} from "../../main.tsx";

export type LayoutProps = {
    children: React.ReactElement | React.ReactElement[] | string[] | string;
}

const Layout = ({children}: LayoutProps) => {
    const {user, logout} = useContext(UserContext);

    return (
        <Flex className="h-100">
            <Flex style={{maxWidth: "25%"}} className="h-100 p-4 ps-4 pe-0 w-25" vertical>
                <ChatList/>
                <Divider/>
                <UserProfile onLeave={logout} user={user} />
            </Flex>
            {children}
        </Flex>
    );
};

export default Layout;
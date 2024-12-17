import React, {useContext, useState} from 'react';
import {Divider, Flex} from "antd";
import './Layout.css'
import ChatList from "../ChatList/ChatList.tsx";
import UserProfile from "../UserProfile/UserProfile.tsx";
import {UserContext} from "../../main.tsx";
import UserProfileModal from "../UserProfileModal/UserProfileModal.tsx";

export type LayoutProps = {
    children: React.ReactElement | React.ReactElement[] | string[] | string;
}

const Layout = ({children}: LayoutProps) => {
    const {user, logout} = useContext(UserContext);
    const [userProfileOpenModal, setUserProfileOpenModal] = useState<boolean>(false);

    return (
        <Flex className="h-100">
            <Flex style={{maxWidth: "25%", minWidth: "20%"}} className="h-100 p-4 ps-4 pe-0 w-25" vertical>
                <ChatList/>
                <Divider/>
                <UserProfile
                    onClick={() => setUserProfileOpenModal(true)}
                    className="hover-scale"
                    rightButtonConfig={{
                        icon: "bi bi-box-arrow-right fs-5",
                        tooltipTitle: "Выйти",
                        type: "link",
                        onClick: logout
                    }}
                    user={user}
                />
                {user && (
                    <UserProfileModal
                        open={userProfileOpenModal}
                        onClose={() => setUserProfileOpenModal(false)}
                        user={user}
                    />
                )}
            </Flex>
            {children}
        </Flex>
    );
};

export default Layout;
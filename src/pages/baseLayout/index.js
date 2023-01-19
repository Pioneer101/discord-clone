import { Outlet } from "react-router";
import ChannelSideBer from "../../components/ChannelSideBer";
import styled from "styled-components";

export const ChannelWapper = styled.div`
    grid-area: room;
    background-color: ${(props) => props.theme.bg_secondary};
`;

const ChatWapper = styled.div`
    grid-area: chat;
    background-color: ${(props) => props.theme.bg_primary};
`;
function BaseLayout() {
    return (
        <>
            <ChannelWapper>{/* <ChannelSideBer /> */}</ChannelWapper>
            <ChatWapper>
                <Outlet />
            </ChatWapper>
        </>
    );
}

export default BaseLayout;

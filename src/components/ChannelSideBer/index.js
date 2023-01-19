import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import ServerTitle from "../ServerTitle";
import ChannelScroll from "../ChannelScroll";
import UserPanel from "../UserPanel";

export const Wapper = styled.div`
    display: flex;
    height: 100vh;
    flex-direction: column;
`;

function ChannelSideBer() {
    let { serverId, channelId } = useParams();
    console.log("ChannelSideBer", serverId, channelId);

    return (
        <Wapper>
            <ServerTitle />
            {/* ServerTitle 為@me 需要變成 searchBar */}
            <ChannelScroll />
            {/* ServerScroll 上方可以預留 updateNotice 跟 newNotice */}
            <UserPanel />
        </Wapper>
    );
}

export default ChannelSideBer;

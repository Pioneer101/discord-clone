import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import ServerList from "../ServerList";
import HorizonLine from "../HorizonLine";
import ServerItemMe from "../ServerItemMe";
import ServerItemButtom from "../ServerItemJoinButton";

export const Wapper = styled.div`
    grid-area: server;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    justify-items: flex-end;
    align-items: center;
    gap: 8px;
    padding-top: 12px;
    padding-bottom: 12px;
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden scroll;
    user-select: none;
    background-color: ${(props) => props.theme.bg_tertiary};
    &::-webkit-scrollbar {
        display: none;
    }
    & > a,
    & > div,
    & > span {
        flex: 0 0 auto;
    }
`;

function ServerSideBar() {
    return (
        <Wapper>
            <ServerItemMe />
            <HorizonLine width="32px" />
            <ServerList />
        </Wapper>
    );
}

export default ServerSideBar;

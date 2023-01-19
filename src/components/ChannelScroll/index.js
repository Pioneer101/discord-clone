import React from "react";
import styled from "styled-components";
import ChannelList from "../ChanneList";

export const Wapper = styled.section`
    flex: 1 1 auto;
    width: 100%;
    /* max-height: 715px; */
    overflow-y: scroll;
    overflow-x: hidden;
    &:hover {
        ::-webkit-scrollbar-thumb {
            display: block;
        }
    }
    ::-webkit-scrollbar {
        display: block;
        overflow: auto;
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        opacity: 0;
        display: none;
        background-color: ${(props) => props.theme.bg_tertiary};
        border-radius: 4px;
    }
`;

function ChannelScroll() {
    return (
        <Wapper>
            <ChannelList />
        </Wapper>
    );
}

export default ChannelScroll;

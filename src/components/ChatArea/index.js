import React from "react";
import styled from "styled-components";

export const Wapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const ChatTitle = styled.section`
    flex: 0 1 48px;
    box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
        0 2px 0 rgba(4, 4, 5, 0.05);
`;
const ChatMain = styled.main`
    flex: 1 1 auto;
`;

function ChatArea() {
    return (
        <Wapper>
            <ChatTitle />
            <ChatMain />
        </Wapper>
    );
}

export default ChatArea;

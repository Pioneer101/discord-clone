import React from "react";
import styled from "styled-components";

const UserName = styled.div`
    font-size: 14px;
    font-weight: 600;
`;
const UserTag = styled.div`
    font-size: 12px;
    line-height: 13px;
    font-weight: 400;
    color: ${(props) => props.theme.header_secondary};
`;
const Wapper = styled.div`
    width: 84px;
    margin-right: 4px;
    user-select: none;
    cursor: pointer;
    flex: 0 1 auto;
`;

function NameTagPanel(props) {
    const { userName, hashTag } = props;
    return (
        <Wapper role="button" aria-label="按一下可複製使用者名稱">
            <UserName>{userName}</UserName>
            <UserTag>#{hashTag}</UserTag>
        </Wapper>
    );
}

export default NameTagPanel;

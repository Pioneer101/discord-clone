import React from "react";
import styled from "styled-components";

const Avatar = styled.img`
    width: 32px;
    height: 32px;
    user-drag: none;
    border-radius: 50%;
    margin-right: 8px;
`;
const OnlineState = styled.span`
    border-radius: 50%;
    position: absolute;
    width: 16px;
    height: 16px;
    transform: translate(-21px, 20px);
    background: ${(props) => props.theme.bg_secondary_alt};

    &:after {
        content: "";
        border-radius: 50%;
        position: absolute;
        width: 10px;
        height: 10px;
        transform: translate(3px, 3px);
        background: ${(props) => props.theme.brand_positive};
    }
`;
const Wapper = styled.div`
    flex: 0 1 auto;
    cursor: pointer;
    user-select: none;
    &:hover {
        img {
            opacity: 0.8;
        }
    }
`;

function AvatarPanel(props) {
    const { avatarSrc } = props;
    return (
        <Wapper>
            <Avatar src={avatarSrc} />
            <OnlineState />
        </Wapper>
    );
}

export default AvatarPanel;

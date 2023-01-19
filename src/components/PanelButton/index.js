import React from "react";
import styled from "styled-components";

const Wapper = styled.div`
    flex: 0 1 auto;
    display: flex;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.bg_modifier_hover};
    }
    path {
        color: ${(props) => props.theme.interactive_normal};
    }
`;

function PanelButton(props) {
    const { width = 32, height = 32, children, role, ariaLabel } = props;
    return (
        <Wapper
            width={width}
            height={height}
            role={role}
            aria-label={ariaLabel}
        >
            {children}
        </Wapper>
    );
}

export default PanelButton;

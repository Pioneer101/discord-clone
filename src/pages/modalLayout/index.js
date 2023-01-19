import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ToolTip from "../../components/ToolTip";

const Wapper = styled.div`
    position: absolute;
    pointer-events: none;
    user-select: none;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
`;

function ModalLayout() {
    return (
        <Wapper>
            <ToolTip />
        </Wapper>
    );
}

export default ModalLayout;

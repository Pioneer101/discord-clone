import { useSelector } from "react-redux";
import styled from "styled-components";
import { getHoverMask } from "../../slices/serverSlice";
import { isFolder } from "../../utils/funciton";

export const MaskTop = styled.span`
    flex: 1 1 auto;
`;
export const MaskMid = styled.span`
    flex: 1 1 auto;
`;
export const MaskBottom = styled.span`
    flex: 1 1 auto;
`;

export const Wapper = styled.div`
    z-index: 1;
    position: absolute;
    left: -12px;
    top: -16px;
    display: flex;
    width: 72px;
    height: 68px;
    flex-direction: column;
    pointer-events: none;
    user-select: none;

    &.hover-top > ${MaskTop}::after {
        content: "";
        background: ${(props) => props.theme.brand_positive};
        position: absolute;
        width: 64px;
        height: 4px;
        border-radius: 5px;
        transform: translate(4px, 260%);
    }
    &.hover-bottom > ${MaskBottom}::after {
        content: "";
        background: ${(props) => props.theme.brand_positive};
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        transform: translate(4px, -2px);
    }
`;

function ServerDragMask(props) {
    const { isDragOther, isItemInFolder, isHovering, serverElId, drag } = props;
    const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
        drag.handle;
    const { maskPart } = drag.state.hoverMaskState;
    const { isDragFolder } = drag.state.dragState;

    const wapperClass = (() => {
        let className = "";
        if (
            isDragOther &&
            isHovering &&
            !(isDragFolder
                ? (isItemInFolder && maskPart === "top") ||
                  maskPart === "bottom"
                : isItemInFolder && maskPart === "bottom")
        )
            className += "hover-" + maskPart;
        return className;
    })();

    return (
        <Wapper
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={wapperClass}
        >
            <MaskTop name="mask" data-id={serverElId} data-mask="top" />
            <MaskBottom name="mask" data-id={serverElId} data-mask="bottom" />
        </Wapper>
    );
}

export default ServerDragMask;

import styled from "styled-components";
import IconJoin from "../IconJoin";
import ServerDragMask from "../ServerDragMask";

export const LastMask = styled.div`
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
    & > span {
        flex: 1 1 auto;
    }
`;

export const Wapper = styled.a`
    background: ${(props) => props.theme.bg_primary};
    position: relative;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    outline: 0;
    cursor: pointer;
    border-radius: 50%;
    opacity: 1;
    transition: opacity 0.2s, border-radius 0.2s, background 0.2s;

    &.active,
    &:hover {
        background: ${(props) => props.theme.brand_positive};
        border-radius: 30%;
        path {
            color: ${(props) => props.theme.header_primary};
        }
    }
    &:active {
        transform: translate(0px, 1px);
    }
    &.dragging-other {
        ${LastMask} {
            pointer-events: auto;
        }
    }
    &.hover-last {
        ${LastMask} span::after {
            content: "";
            background: ${(props) => props.theme.brand_positive};
            position: absolute;
            width: 64px;
            height: 4px;
            border-radius: 5px;
            transform: translate(4px, 260%);
        }
    }
`;

function ServerItemButton(props) {
    const { drag } = props;

    const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
        drag.handle;
    const { hoverElId, maskPart } = drag.state.hoverMaskState;
    const { draggingElId } = drag.state.draggingState;
    const isDraggingOther = draggingElId !== null;
    const isHovering = "last" === hoverElId;
    const handleClick = () => {};

    const wapperClass = (() => {
        let className = "";
        if (isDraggingOther) className += "dragging-other ";
        if (isDraggingOther && isHovering) className += "hover-" + maskPart;
        return className;
    })();

    return (
        <>
            <Wapper
                onClick={handleClick}
                className={wapperClass}
                role="treeItem"
                aria-label="新增一個伺服器"
            >
                <IconJoin />
                <LastMask
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <span name="mask" data-id="last" data-mask="last" />
                </LastMask>
            </Wapper>
        </>
    );
}

export default ServerItemButton;

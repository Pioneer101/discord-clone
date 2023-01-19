import styled from "styled-components";
import { Wapper as ServerItemWapper } from "../ServerItem";
import { parseFolderId } from "../../utils/funciton";
import { MaskBottom } from "../ServerDragMask";
import {
    getHoverMask,
    getServerData,
    getServerEl,
} from "../../slices/serverSlice";
import { useSelector } from "react-redux";
import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";

const FolderBackground = styled.span`
    z-index: 0;
    position: absolute;
    height: 48px;
    width: 48px;
    border-radius: 24px;
    user-select: none;
    background: ${(props) => props.theme.bg_secondary};
    transition: visibility 0.2s, height 0.2s;
`;

const FolderWapper = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    justify-items: flex-end;
    gap: 8px;
    align-items: center;
    height: 48px;
    transition: height 0.2s;

    &.hover-in-folder-bottom {
        padding-bottom: 24px;
        ${ServerItemWapper}:last-child {
            ${MaskBottom}::after {
                content: "";
                background: ${(props) => props.theme.brand_positive};
                position: absolute;
                width: 64px;
                height: 4px;
                border-radius: 5px;
                transform: translate(4px, 36px);
            }
        }
        ${FolderBackground} {
            padding-bottom: 24px;
        }
    }

    &.folderOpening {
        height: ${({ folderLength }) => folderLength * 56 + 48}px;
        ${FolderBackground} {
            visibility: visible;
            height: ${({ folderLength }) => folderLength * 56 + 48}px;
        }
    }
    &.folderDragging {
        overflow: hidden;
    }
`;

function FolderAccordion(props) {
    const { isOpen, folderLength, serverElId, drag, children } = props;
    const { folderElId, isLastOfFolder, isFolder } = drag.state.hoverMaskState;
    const { draggingElId, isDraggingFolder } = drag.state.draggingState;
    const isFolderDragging = serverElId === draggingElId;

    const wapperClass = (() => {
        let className = "";
        if (isOpen) className = "folderOpening ";
        if (isFolderDragging) className = "folderDragging ";
        if (
            folderElId === serverElId &&
            !isFolder &&
            isLastOfFolder &&
            !isDraggingFolder
        )
            className += "hover-in-folder-bottom ";
        return className;
    })();

    return (
        <FolderWapper
            name="folderAccordion"
            className={wapperClass}
            folderLength={folderLength}
        >
            <FolderBackground folderLength={folderLength} />
            {children}
        </FolderWapper>
    );
}

export default FolderAccordion;

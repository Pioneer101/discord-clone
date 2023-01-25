import { useSelector } from "react-redux";
import styled from "styled-components";
import {
    getIsActiveServer,
    getServerDataByIndex,
} from "../../slices/serverSlice";
import ServerDragMask, {
    Wapper as ServerDragMaskWapper,
} from "../ServerDragMask";
import {
    Wapper as ServerNoticeCounterWapper,
    NoticeContent,
    NoticeBorder,
    NoticeMask,
} from "../ServerNoticeCounter";

import ServerItemContent, {
    Wapper as ServerItemContentWapper,
    ItemLink,
    ItemGrid,
} from "../ServerItemContent";
import { LastMask } from "../ServerItemJoinButton";

export const ServerItemNotice = styled.div`
    background: ${(props) => props.theme.header_primary};
    position: absolute;
    width: ${({ showNotice }) => (showNotice ? 8 : 0)}px;
    height: ${({ showNotice }) => (showNotice ? 8 : 0)}px;

    border-radius: 0 4px 4px 0;
    transform: translate(-16px, 0px);
    transition: height 0.1s, width 0.1s;
`;
export const Wapper = styled.a`
    position: relative;
    flex-direction: column;
    display: flex;
    justify-content: center;
    width: 48px;
    height: 48px;
    outline: 0;
    border-radius: 33%;
    opacity: 1;
    transition: opacity 0.1s, border-radius 0.1s;

    &.hidding {
        opacity: 0;
    }

    &.active {
        & > ${ServerItemContentWapper} {
            background: ${(props) => props.theme.brand_normal};
            border-radius: 33%;
            & ${ItemLink} {
                color: ${(props) => props.theme.header_primary};
                & path {
                    color: ${(props) => props.theme.header_primary};
                }
            }
        }
        & > ${ServerItemNotice} {
            width: 8px;
            height: 40px;
        }
        ${NoticeMask} {
            border-radius: 33% !important;
        }
    }

    &.dragging-other {
        & > ${ServerDragMaskWapper} {
            pointer-events: auto;
        }
        &:not(.active):not(.folder) > ${ServerItemContentWapper} {
            background: ${(props) => props.theme.bg_primary}!important;
            border-radius: 50%;
        }
    }

    &.dragging {
        ${ServerNoticeCounterWapper} > span {
            display: none;
        }
        ${ServerItemNotice} {
            width: 0px !important;
            height: 0px !important;
        }
        ${ServerItemContentWapper} {
            border-radius: 33%;
            background: ${(props) => props.theme.bg_primary}!important;
            & ${ItemLink} {
                opacity: 0;
            }
            & path {
                opacity: 0;
            }
        }
        ${NoticeMask} {
            display: none;
        }
        &.folder {
            ${ServerItemContentWapper} {
                background: ${(props) => props.theme.bg_primary}!important;
            }
        }
    }

    &:hover {
        &:not(.active) > ${ServerItemNotice} {
            width: 8px;
            height: 20px;
        }
        &.folder > ${ServerItemContentWapper} {
            &::after {
                content: "";
                width: 48px;
                height: 48px;
                position: absolute;
                border-radius: 33%;
                background: ${(props) =>
                    props.theme.bg_modifier_hover}!important;
            }
        }
        &:not(.folder):not(.folder-shaking) > ${ServerItemContentWapper} {
            border-radius: 33%;
            background: ${(props) => props.theme.brand_normal};
            & ${ItemLink} {
                color: ${(props) => props.theme.header_primary};
                & path {
                    color: ${(props) => props.theme.header_primary};
                }
            }
        }
        ${NoticeMask} {
            border-radius: 33% !important;
        }
    }

    &.folder-shaking,
    &.folder {
        :active {
            transform: translateY(-1px);
            ${ServerItemNotice} {
                transform: translate(-16px, 1px);
            }
        }
        ${ServerItemContentWapper} {
            border-radius: 33% !important;
            background: ${(props) => props.theme.fl_normal_alt}!important;
            ${ItemGrid} {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                width: 40px;
                height: 40px;
                padding: 4px;
                ${ItemLink} {
                    z-index: 3;
                    background: ${(props) => props.theme.bg_secondary};
                    width: 16px;
                    height: 16px;
                    font-size: 4px;
                    border-radius: 50%;
                    justify-content: flex-start;
                    justify-self: center;
                    align-self: center;
                }
            }
            ${NoticeMask} {
                border-radius: 33% !important;
            }
        }
        &.opening {
            ${ServerItemContentWapper} {
                background: ${(props) => props.theme.bg_secondary}!important;
            }
            ${NoticeContent} ,${NoticeBorder} {
                transform: translate(5px, 5px);
                opacity: 0;
            }
        }
        &.active {
            transform: translateY(0px);
            ${ServerItemNotice} {
                transform: translate(-16px, -1px);
            }
        }
    }

    &.folder-shaking:not(.opening) {
        ${ServerItemContentWapper} {
            animation-name: folder;
            animation-duration: 0.1s;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
        }
    }

    @keyframes folder {
        to {
            transform: rotate(-1.5deg);
        }
        from {
            transform: rotate(1.5deg);
        }
    }
`;

function ServerItem(props) {
    const { index, drag } = props;
    const { hoverElId, maskPart } = drag.state.hoverMaskState;
    const { dragElId, isDragFolder } = drag.state.dragState;
    const { serverElState, serverData } = useSelector(
        getServerDataByIndex(index)
    );
    const { noticeCount, serverNames } = serverData;
    const { isFolder, isOpen, serverElId, folderElId } = serverElState;
    const inFolder = !!folderElId;
    const isActive = useSelector(getIsActiveServer(serverElId));
    const isDrag = dragElId === serverElId;
    const isHovering = serverElId === hoverElId;
    const isDragOther = dragElId !== null;
    const isItemInFolder = !isFolder && inFolder;
    const isShaking =
        maskPart === "bottom" &&
        isHovering &&
        isDragOther &&
        !isDragFolder &&
        ((isFolder && !isOpen) || !inFolder);

    const wapperClass = (() => {
        let className = "";
        if (isFolder) className += "folder ";
        if (isOpen) className += "opening ";
        if (isActive) className += "active ";
        if (isShaking) className += "folder-shaking ";
        if (isDrag) className += "dragging ";
        if (!isDrag && isDragOther) className += "dragging-other ";
        return className;
    })();
    const toolTipLabel = serverNames.join(", ");

    return (
        <>
            <Wapper
                className={wapperClass}
                role="treeItem"
                aria-label={toolTipLabel}
            >
                <ServerItemNotice showNotice={noticeCount > 0 && !isOpen} />
                <ServerItemContent
                    serverElState={serverElState}
                    serverData={serverData}
                    isItemInFolder={isItemInFolder}
                    drag={drag}
                />
                <ServerDragMask
                    serverElId={serverElId}
                    isDragOther={isDragOther}
                    isOpen={isOpen}
                    isItemInFolder={isItemInFolder}
                    isHovering={isHovering}
                    drag={drag}
                />
            </Wapper>
        </>
    );
}

export default ServerItem;

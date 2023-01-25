import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getChannelByIndex } from "../../slices/channelSlice";
import IconSet from "../IconSet";

const ChannelButton = styled.div`
    cursor: pointer;
    padding: 6px 2px;
    display: flex;
    align-items: center;
    &:hover {
        path,
        polygon {
            color: ${(props) => props.theme.interactive_hover};
        }
    }
`;
const ControllPanel = styled.div`
    display: flex;
    flex: 0 0 auto;
`;

const ChannelName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props) => props.theme.channels_default};
`;
const ChannelIcon = styled.div``;

const ChannelDragMaskWapper = styled.div`
    position: absolute;
    width: 232px;
    pointer-events: none;
`;

function ChannelDragMask(props) {
    const { channelElState, channelData, drag, index } = props;
    const { handle } = drag;
    const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
        handle;
    const { channelElId } = channelElState;
    const { type } = channelData;
    return (
        <ChannelDragMaskWapper
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-id={channelElId}
            data-type={type}
            data-index={index}
        />
    );
}

export const Wapper = styled.div`
    flex: 1 1 auto;
    display: flex;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;path,
    polygon {
        color: ${(props) => props.theme.channels_default};
    }
    &:hover {
        ${ChannelName} {
            color: ${(props) => props.theme.header_primary};
        }
    }
    &.disable {
        ${ChannelName}, ${ChannelIcon} {
            opacity: 0.2;
        }
    }
    &.hovering-top,&.hovering-bottom {
        ${ChannelDragMaskWapper}:after {
            content: "";
            background: ${(props) => props.theme.brand_positive};
            position: absolute;
            width: 226px;
            height: 4px;
            border-radius: 5px;
        }
    }
    &.hovering-top {
        ${ChannelDragMaskWapper}:after {
            transform: translate(8px, -4px);
        }
    }
    &.dragging,&.dragging-other{
        ${ChannelDragMaskWapper}{
            pointer-events:auto;
        }
    }
    &.folder {
        align-items: center;
        width: 225px;
        max-height: 24px;
        margin-top: 16px;

        ${ChannelName} {
            flex: 1 0 auto;
            font-size: 12px;
            line-height: 24px;
            letter-spacing: 0.02em;
            font-weight: 500;
        }
        ${ChannelIcon} {
            height: 12px;
            width: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            svg {
                transform: rotate(-0.25turn);
                transition: transform 0.2s;
            }
        }
        ${ChannelDragMaskWapper} {
            height: 44px;
            transform: translate(0px, -4px);
        }
        &.opening 
            svg {
                transform: rotate(0turn);
            }
        }
        &.hovering-bottom {
            ${ChannelDragMaskWapper}:after {
                transform: translate(8px, 36px);
            }
        }
    }
    &.item {
        width: 216px;
        max-height: 20px;
        margin-left: 8px;
        margin-right: 4px;
        padding: 6px 2px 6px 8px;

        ${ControllPanel} {
            opacity: 0;
        }
        ${ChannelName} {
            font-size: 16px;
            line-height: 20px;
            font-weight: 500;
            width: 142px;
        }
        ${ChannelIcon} {
            margin-right: 6px;
        }
        ${ChannelDragMaskWapper} {
            height: 34px;
            transform: translate(-16px, -4px);
        }
        &:active {
            background-color: ${({ theme }) =>
                theme.bg_modifier_selected}!important;
        }
        &:hover {
            background-color: ${({ theme }) => theme.bg_modifier_hover};
            ${ControllPanel} {
                opacity: 1;
            }
        }
        &.hovering-bottom {
            ${ChannelDragMaskWapper}:after {
                transform: translate(8px, 28px);
            }
        }
    }
`;

function ChannelItem(props) {
    const { index, drag } = props;
    const { channelElState, channelData } = useSelector(
        getChannelByIndex(index)
    );
    const { handle, state } = drag;
    const { dragState, hoverState } = state;
    const { dragElId, dragType, dragIndex, dragFolderElId, isFirstFolder } =
        dragState;
    const { hoverElId, hoverType, hoverFolderElId, hoverDirection, canHover } =
        hoverState;
    const { handleDragStart, handleToggleFolder } = handle;
    const { channelElId, isOpen, isFolder } = channelElState;
    const { channelName, type } = channelData;

    const isHover = hoverElId === channelElId;
    const isDrag = dragElId && dragElId === channelElId;
    const isDragOther = dragElId && !isDrag;
    const isDragOtherDisable =
        dragElId &&
        isDragOther &&
        !isFolder &&
        (dragType === "folder" ? true : type !== dragType);

    const wapperClass = (() => {
        let className = "";
        if (isFolder) className += "folder ";
        if (!isFolder) className += "item ";
        if (isOpen) className += "opening ";
        if (isDrag) className += "dragging ";
        if (isDragOther) className += "dragging-other ";
        if (isDragOtherDisable) className += "disable ";
        if (isHover && canHover) className += `hovering-${hoverDirection} `;
        return className;
    })();
    return (
        <Wapper
            onDragStart={handleDragStart}
            draggable="true"
            data-id={channelElId}
            data-type={type}
            data-index={index}
            className={wapperClass}
            onClick={
                isFolder ? () => handleToggleFolder(channelElId) : undefined
            }
        >
            <ChannelIcon>
                {isFolder ? (
                    <IconSet width="12" height="12" name="down" />
                ) : (
                    <IconSet width="20" height="20" name={type} />
                )}
            </ChannelIcon>
            <ChannelName>{channelName}</ChannelName>
            <ControllPanel>
                {isFolder ? (
                    <ChannelButton role="button" aria-label="建立頻道">
                        <IconSet width="18" height="18" name="add" />
                    </ChannelButton>
                ) : (
                    <>
                        <ChannelButton role="button" aria-label="邀請成員">
                            <IconSet width="16" height="16" name="invite" />
                        </ChannelButton>
                        <ChannelButton role="button" aria-label="頻道編輯">
                            <IconSet width="16" height="16" name="setting" />
                        </ChannelButton>
                    </>
                )}
            </ControllPanel>
            <ChannelDragMask
                drag={drag}
                index={index}
                channelElState={channelElState}
                channelData={channelData}
            />
        </Wapper>
    );
}

export default ChannelItem;

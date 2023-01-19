import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
    channelElMove,
    folderToggle,
    getChannelData,
    getChannelEl,
    getChannelElState,
} from "../../slices/channelSlice";
import { findElIdByDataId } from "../../utils/funciton";
import ChannelItem from "../ChannelItem";

const DefaultArea = styled.div`
    flex: 1 1 auto;
    height: 16px;
`;

export const Wapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5px;
`;

function useDrag(channelEl, channelElState, channelData) {
    const initialState = {
        dragState: {
            dragElId: null,
            dragType: null,
            dragIndex: null,
            dragFolderElId: null,
            isFirstFolder: false,
        },
        hoverState: {
            hoverElId: null,
            hoverType: null,
            hoverFolderElId: null,
            canHover: false,
        },
    };
    const [dragState, setDragState] = useState(initialState.dragState);
    const [hoverState, setHoverState] = useState(initialState.hoverState);
    const dispatch = useDispatch();

    const clearState = () => {
        const { dragState, hoverState } = initialState;
        setDragState(dragState);
        setHoverState(hoverState);
    };
    const handleDragStart = (e) => {
        const { id, index, type } = e.currentTarget.dataset;
        console.log("Start", id, type);
        const targetElState = channelElState[id];
        const { folderElId } = targetElState;

        const firstFolderElId = channelEl.find(
            (elId) => channelElState[elId].isFolder
        );

        const newHoverState = {
            dragElId: id,
            dragType: type,
            dragIndex: index,
            dragFolderElId: folderElId,
            isFirstFolder: firstFolderElId === id,
        };
        setDragState(newHoverState);
    };
    const handleDragEnter = (e) => {
        const {
            id: hoverElId,
            index: hoverIndex,
            type: hoverType,
        } = e.target.dataset;
        console.log("handleDragEnter", hoverElId);
        const targetElState = channelElState[hoverElId];
        const { dragIndex, dragType } = dragState;
        const { channelId, folderElId } = targetElState;

        /*
            F
                T
                V

            text    top     prev item != voice
                    bottom  folder
            voice   top     folder
                    bottom  next item != text
                    
        */

        const hoverDirection = dragIndex >= hoverIndex ? "top" : "bottom";
        let canHover = false;
        if (dragType !== "folder" && dragType === hoverType) {
            canHover = true;
        } else {
            switch (dragType) {
                case "text":
                    switch (hoverDirection) {
                        case "top":
                            const prevElId = channelEl[hoverIndex - 1];
                            if (!prevElId) canHover = true;
                            const { channelId } = channelElState[prevElId];
                            const { type } = channelData[channelId[0]];
                            if (type !== "voice") canHover = true;
                            break;
                        case "bottom":
                            if (hoverElId === folderElId) {
                                canHover = true;
                            }
                            break;
                        default:
                    }
                    break;
                case "voice":
                    switch (hoverDirection) {
                        case "top":
                            if (hoverElId === folderElId) {
                                canHover = true;
                            }
                            break;
                        case "bottom":
                            const nextElId = channelEl[+hoverIndex + 1];
                            if (!nextElId) canHover = true;
                            const { channelId } = channelElState[nextElId];
                            const { type } = channelData[channelId[0]];
                            if (type !== "text") canHover = true;
                            break;
                        default:
                    }
                    break;
                case "folder":
                    switch (hoverDirection) {
                        case "top":
                            {
                                const prevElId = channelEl[hoverIndex - 1];
                                if (!prevElId) break;
                                const { channelId } = channelElState[prevElId];
                                const { type } = channelData[channelId[0]];
                                if (hoverType === "folder" && type !== "folder")
                                    canHover = true;
                            }
                            break;
                        case "bottom":
                            {
                                const nextElId = channelEl[+hoverIndex + 1];
                                if (!nextElId) {
                                    canHover = true;
                                    break;
                                }
                                const { channelId } = channelElState[nextElId];
                                const { type } = channelData[channelId[0]];
                                if (type === "folder") canHover = true;
                            }
                            break;
                        default:
                    }
                    break;
                default:
            }
        }

        const newHoverState = {
            hoverElId,
            hoverType,
            hoverFolderElId: folderElId,
            hoverDirection,
            canHover: canHover,
        };
        setHoverState(newHoverState);

        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = (e) => {
        // 防止 Drop 無效
        e.preventDefault();
    };
    const handleDrop = (e) => {
        dispatch(channelElMove({ dragState, dropState: hoverState }));
        console.log("handleDrop");
        clearState();
        // console.log("Drop");
    };
    const handleDragEnd = (e) => {
        // console.log("End");
        console.log("handleDragEnd");
        clearState();
        e.preventDefault();
        e.stopPropagation();
    };
    const handleToggleFolder = (channelElId) => {
        dispatch(folderToggle(channelElId));
    };

    const state = { dragState, hoverState };
    const action = {};

    const handle = {
        handleDragEnter,
        handleDragLeave,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleToggleFolder,
    };

    useEffect(() => {
        document.addEventListener("dragend", handleDragEnd);
        return () => {
            document.removeEventListener("dragend", handleDragEnd);
        };
    }, []);

    return { state, action, handle };
}

function ChannelList() {
    const channelEl = useSelector(getChannelEl);
    const channelElState = useSelector(getChannelElState);
    const channelData = useSelector(getChannelData);
    const drag = useDrag(channelEl, channelElState, channelData);

    const spawnChannelList = channelEl.map((elId, index) => {
        // console.log("ChannelList", channelElState, elId, channelEl);
        const { isFolder, isOpen, channelId } = channelElState[elId];

        // console.log("ChannelList", channelElState, channelId);
        const itemKeyStr = `${isFolder ? "folder" : "item"}-${channelId.join(
            "-"
        )}`;

        return <ChannelItem key={itemKeyStr} index={index} drag={drag} />;
    });
    return (
        <Wapper>
            <DefaultArea />
            {spawnChannelList}
        </Wapper>
    );
}

export default ChannelList;

import ServerItem from "../ServerItem";
import {
    getServerEl,
    getServerElData,
    serverElMove,
} from "../../slices/serverSlice";
import { useDispatch, useSelector } from "react-redux";
import FolderAccordion from "../FolderAccordion";
import { useEffect, useState } from "react";
import ServerItemButton from "../ServerItemJoinButton";

function useDrag(serverElState) {
    const initialState = {
        dragState: { dragElId: null, isDragFolder: false },
        hoverMask: {
            maskPart: null,
            hoverEld: null,
            folderElId: false,
            hoverState: 0,
            isLastItemOfFolder: false,
            isFolder: false,
        },
    };
    const [hoverMaskState, setHoverMaskState] = useState(
        initialState.hoverMask
    );
    const [dragState, setDragState] = useState(initialState.dragState);
    const dispatch = useDispatch();

    const setHoverMask = (hoverMask) => {
        setHoverMaskState((preHoverMask) => {
            // const { hoverState: prevHoverState } = preHoverMask;
            const [hoverElId, maskPart, hoverState] = hoverMask;
            // const currentHoverState = prevHoverState + hoverState;
            let newHoverMask;

            // if (currentHoverState === 0) {
            //     newHoverMask = initialState.hoverMask;
            // } else {
            // if (hoverState === 1) {
            if (maskPart === "last") {
                // Last Item 固定行為
                newHoverMask = {
                    ...initialState.hoverMask,
                    hoverEld: hoverElId,
                    maskPart: maskPart,
                };
            } else {
                // 更新當前 HoverMask
                const currElId = hoverElId;
                const currMaskPart = maskPart;
                const currFolderElId = serverElState[currElId].folderElId;
                const currIsFolder = serverElState[currElId].isFolder;
                const folderServerId = serverElState[currFolderElId]?.serverId;
                const currentServerId =
                    currElId !== currFolderElId &&
                    serverElState[currElId].serverId[0];
                const currIsLastOfFolder = !!(
                    folderServerId &&
                    maskPart === "bottom" &&
                    currentServerId &&
                    folderServerId.slice(-1)[0] === currentServerId
                );

                newHoverMask = {
                    hoverElId: currElId,
                    maskPart: currMaskPart,
                    // hoverState: currentHoverState,
                    isLastItemOfFolder: currIsLastOfFolder,
                    folderElId: currFolderElId,
                    isFolder: currIsFolder,
                };
            }
            // } else if (hoverState === -1) {
            //     // Leave 時恢復上一次
            //     newHoverMask = {
            //         ...preHoverMask,
            //         hoverState: currentHoverState,
            //     };
            // }
            // }
            return newHoverMask;
        });
    };
    const clearHoverMask = () => setHoverMaskState(initialState.hoverMask);

    const setDragElId = (dragElId) => {
        const { isFolder } = serverElState[dragElId];
        setDragState(() => ({ dragElId, isDragFolder: isFolder }));
    };
    const clearDragState = () => setDragState(initialState.dragState);

    const handleDragStart = (e) => {
        console.log("Start", e.target.dataset.id, e.currentTarget.dataset.id);
        setDragElId(e.currentTarget.dataset.id);
    };
    const handleDragEnter = (e) => {
        const { id, mask } = e.target.dataset;
        console.log("handleDragEnter", id, mask);
        setHoverMask([id, mask, 1]);
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = (e) => {
        const { id, mask } = e.target.dataset;
        // setHoverMask([id, mask, -1]);
        console.log("handleDragLeave", id, mask);
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = (e) => {
        // 防止 Drop 無效
        e.preventDefault();
    };
    const handleDrop = (e) => {
        dispatch(serverElMove({ dragState, hoverMaskState }));
        clearDragState();
        clearHoverMask();
        // console.log("Drop");
    };
    const handleDragEnd = (e) => {
        // console.log("End");
        clearDragState();
        clearHoverMask();
        e.preventDefault();
        e.stopPropagation();
    };
    const handleMouseEnter = (e) => {
        // console.log("MouseEnter", hoverMaskState, dragState);
    };

    const state = {
        hoverMaskState,
        dragState,
    };
    const action = { setDragElId };

    const handle = {
        handleDragEnter,
        handleDragLeave,
        handleDragStart,
        handleDragOver,
        handleDrop,
    };

    useEffect(() => {
        document.addEventListener("dragend", handleDragEnd);
        document.addEventListener("mouseenter", handleMouseEnter);
        return () => {
            document.removeEventListener("dragend", handleDragEnd);
            document.addEventListener("mouseenter", handleMouseEnter);
        };
    }, []);

    return { state, action, handle };
}

function ServerList(props) {
    const serverEl = useSelector(getServerEl);
    const serverElState = useSelector(getServerElData);
    const drag = useDrag(serverElState);

    const spawnServerList = () => {
        let serverListEls = [];
        let folderEls = [];
        let folderLastInedx = 0;
        let folderServerElId = null;
        let folderServerIds = [];
        let folderLength = 0;

        const resetFolderState = () => {
            folderEls = [];
            folderLastInedx = 0;
            folderServerElId = null;
            folderServerIds = [];
            folderLength = 0;
        };
        const spawnFolderAccordion = (
            isOpen,
            folderLength,
            folderServerElId,
            folderAccordionKeyStr
        ) => (
            <FolderAccordion
                isOpen={isOpen}
                folderLength={folderLength}
                serverElId={folderServerElId}
                drag={drag}
                key={folderAccordionKeyStr}
            >
                {folderEls}
            </FolderAccordion>
        );

        for (let index = 0; index < serverEl.length; index++) {
            const serverElId = serverEl[index];
            const { isFolder, isOpen, serverId } = serverElState[serverElId];
            const itemKeyStr = `${isFolder ? "folder" : "item"}-${serverId.join(
                "-"
            )}`;
            const folderAccordionKeyStr = (serverId) =>
                `folderAccordion-${serverId.join("-")}`;
            const resultEl = (
                <ServerItem key={itemKeyStr} drag={drag} index={index} />
            );
            if (isFolder) {
                folderServerIds = serverId;
                folderLength = serverId.length;
                folderLastInedx = index + folderLength;
                folderServerElId = serverElId;
                folderEls.push(resultEl);
                if (!isOpen) {
                    const folderAccordionEl = spawnFolderAccordion(
                        isOpen,
                        folderLength,
                        folderServerElId,
                        folderAccordionKeyStr(folderServerIds)
                    );
                    serverListEls.push(folderAccordionEl);
                    resetFolderState();
                }
            } else if (folderServerIds.includes(serverId[0])) {
                const isLastFolderEl = index === folderLastInedx;
                folderEls.push(resultEl);
                if (isLastFolderEl) {
                    const folderAccordionEl = spawnFolderAccordion(
                        true,
                        folderLength,
                        folderServerElId,
                        folderAccordionKeyStr(folderServerIds)
                    );
                    serverListEls.push(folderAccordionEl);
                    resetFolderState();
                }
            } else {
                serverListEls.push(resultEl);
                resetFolderState();
            }
        }
        return serverListEls;
    };
    return (
        <>
            {spawnServerList()}
            <ServerItemButton drag={drag} />
        </>
    );
}

export default ServerList;

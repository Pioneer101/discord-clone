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
        draggingState: { draggingElId: null, isDraggingFolder: false },
        hoverMask: {
            maskPart: null,
            hoverEld: null,
            folderElId: false,
            hoverState: 0,
            isLastOfFolder: false,
            isFolder: false,
        },
    };
    const [hoverMaskState, setHoverMaskState] = useState(
        initialState.hoverMask
    );
    const [draggingState, setDraggingState] = useState(
        initialState.draggingState
    );
    const dispatch = useDispatch();

    const setHoverMask = (hoverMask) => {
        setHoverMaskState((preHoverMask) => {
            const {
                hoverElId: prevHoverElId,
                maskPart: prevMask,
                hoverState: prevHoverState,
                isLastOfFolder: prevIsLastOfFolder,
                folderElId: prevFolderElId,
                isFolder: prevIsFolder,
            } = preHoverMask;
            const [hoverElId, maskPart, hoverState] = hoverMask;
            const currentHoverState = prevHoverState + hoverState;
            let newHoverMask,
                currElId,
                currMaskPart,
                currIsLastOfFolder,
                currFolderElId,
                currIsFolder;

            if (currentHoverState === 0) {
                newHoverMask = {
                    maskPart: null,
                    hoverEld: null,
                    folderElId: false,
                    hoverState: 0,
                    isLastOfFolder: false,
                };
            } else {
                if (hoverState === 1) {
                    if (maskPart === "last") {
                        currElId = hoverElId;
                        currMaskPart = maskPart;
                        currFolderElId = false;
                        currIsLastOfFolder = false;
                        currIsFolder = false;
                    } else {
                        currElId = hoverElId;
                        currMaskPart = maskPart;
                        currFolderElId = serverElState[currElId].folderElId;
                        const folderServerId =
                            serverElState[currFolderElId]?.serverId;
                        const currentServerId =
                            currElId !== currFolderElId &&
                            serverElState[currElId].serverId[0];
                        currIsLastOfFolder = !!(
                            folderServerId &&
                            maskPart === "bottom" &&
                            currentServerId &&
                            folderServerId.slice(-1)[0] === currentServerId
                        );
                        currIsFolder = serverElState[currElId].isFolder;
                    }
                } else if (hoverState === -1) {
                    currElId = prevHoverElId;
                    currMaskPart = prevMask;
                    currIsLastOfFolder = prevIsLastOfFolder;
                    currFolderElId = prevFolderElId;
                    currIsFolder = prevIsFolder;
                }

                newHoverMask = {
                    hoverElId: currElId,
                    maskPart: currMaskPart,
                    hoverState: currentHoverState,
                    isLastOfFolder: currIsLastOfFolder,
                    folderElId: currFolderElId,
                    isFolder: currIsFolder,
                };
            }
            return newHoverMask;
        });
    };
    const clearHoverMask = () => setHoverMaskState(initialState.hoverMask);

    const setDraggingElId = (draggingElId) => {
        const { isFolder } = serverElState[draggingElId];
        setDraggingState(() => ({ draggingElId, isDraggingFolder: isFolder }));
    };
    const clearDraggingState = () =>
        setDraggingState(initialState.draggingState);

    const handleDragStart = (e) => {
        console.log("Start", e.target.dataset.id, e.currentTarget.dataset.id);
        setDraggingElId(e.currentTarget.dataset.id);
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
        setHoverMask([id, mask, -1]);
        console.log("handleDragLeave", id, mask);
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = (e) => {
        // 防止 Drop 無效
        e.preventDefault();
    };
    const handleDrop = (e) => {
        dispatch(serverElMove({ draggingState, hoverMaskState }));
        clearDraggingState();
        clearHoverMask();
        // console.log("Drop");
    };
    const handleDragEnd = (e) => {
        // console.log("End");
        clearDraggingState();
        clearHoverMask();
        e.preventDefault();
        e.stopPropagation();
    };
    const handleMouseEnter = (e) => {
        // console.log("MouseEnter", hoverMaskState, draggingState);
    };

    const state = {
        hoverMaskState,
        draggingState,
    };
    const action = { setDraggingElId };

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
                    serverListEls.push(
                        spawnFolderAccordion(
                            isOpen,
                            folderLength,
                            folderServerElId,
                            folderAccordionKeyStr(folderServerIds)
                        )
                    );
                    resetFolderState();
                }
            } else if (folderServerIds.includes(serverId[0])) {
                const isLastFolderEl = index === folderLastInedx;
                folderEls.push(resultEl);
                if (isLastFolderEl) {
                    serverListEls.push(
                        spawnFolderAccordion(
                            true,
                            folderLength,
                            folderServerElId,
                            folderAccordionKeyStr(folderServerIds)
                        )
                    );
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

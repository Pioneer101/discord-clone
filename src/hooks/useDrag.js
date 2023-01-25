import { serverElMove } from "../slices/serverSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function useDrag(serverElState) {
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

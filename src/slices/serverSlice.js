import { createSlice } from "@reduxjs/toolkit";
import { swap, remove, insert, findElIdByDataId } from "../utils/funciton";

const initialState = {
    firstOpenApp: true,
    activeServerElId: "@me",
    serverEl: ["2", "3", "4", "5", "99", "1", "10", "11", "12"],
    serverElState: {
        "@me": {
            serverId: [],
            serverElId: "@me",
        },
        99: {
            serverId: ["312"],
            serverElId: "99",
            folderElId: false,
            isFolder: false,
            isOpen: false,
        },
        1: {
            serverId: ["1"],
            serverElId: "1",
            folderElId: false,
            isFolder: false,
            isOpen: false,
        },
        2: {
            serverId: ["2"],
            serverElId: "2",
            folderElId: false,
            isFolder: false,
            isOpen: false,
        },
        3: {
            serverId: ["3", "7"],
            serverElId: "3",
            folderElId: "3",
            isFolder: true,
            isOpen: true,
        },
        4: {
            serverId: ["3"],
            serverElId: "4",
            folderElId: "3",
            isFolder: false,
            isOpen: false,
        },
        5: {
            serverId: ["7"],
            serverElId: "5",
            folderElId: "3",
            isFolder: false,
            isOpen: false,
        },
        10: {
            serverId: ["11", "12"],
            serverElId: "10",
            folderElId: "10",
            isFolder: true,
            isOpen: true,
        },
        11: {
            serverId: ["11"],
            serverElId: "11",
            folderElId: "10",
            isFolder: false,
            isOpen: false,
        },
        12: {
            serverId: ["12"],
            serverElId: "12",
            folderElId: "10",
            isFolder: false,
            isOpen: false,
        },
    },
    serverData: {
        312: {
            serverName: "伺服312",
            serverIcon: "",
            showNotice: true,
            noticeCount: 0,
        },
        1: {
            serverName: "伺服1",
            serverIcon: "",
            showNotice: true,
            noticeCount: 12,
        },
        2: {
            serverName: "伺服2",
            serverIcon: "",
            showNotice: false,
            noticeCount: 123,
        },
        3: {
            serverName: "伺服3",
            serverIcon: "",
            showNotice: true,
            noticeCount: 14,
        },
        7: {
            serverName: "伺服7",
            serverIcon: "",
            showNotice: false,
            noticeCount: 999,
        },
        11: {
            serverName: "伺11",
            serverIcon: "",
            showNotice: true,
            noticeCount: 11,
        },
        12: {
            serverName: "伺12",
            serverIcon: "",
            showNotice: false,
            noticeCount: 12,
        },
    },
    chatData: {
        1: [
            {
                content: `LOL 測試消息`,
                updateTime: null,
                createTime: "TIMESTRAMP",
            },
        ],
    },
    userData: {
        me: {
            userName: "z89775",
            hashTag: "4608",
            avatarSrc:
                "https://i.picsum.photos/id/939/48/48.jpg?hmac=ZpV5WA31qrK56JhVKmh_3G34vUwIuNDygTZzzb9fpow",
        },
    },
};

export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setActiveServerElId: (state, action) => {
            const serverElId = action.payload;
            state.activeServerElId = serverElId;
            state.firstOpenApp = false;
        },
        setDraggingServerElId: (state, action) => {
            const serverElId = action.payload;
            state.draggingServerElId = serverElId;
        },
        serverElMove: (state, action) => {
            const { draggingState, hoverMaskState } = action.payload;
            const { serverEl, serverElState } = state;

            console.log("@@@@@@@@@ serverElMove START", [...serverEl]);
            const { draggingElId: dragElId, isDraggingFolder: isDragFolder } =
                draggingState;
            const dragElData = serverElState[dragElId];
            const { serverId: dragServerId, folderElId: dragFolderElId } =
                dragElData;
            const inDragFolder = !!dragFolderElId;
            const isDragItemInFolder = inDragFolder && !isDragFolder;
            const dragElIndex = serverEl.indexOf(dragElId);
            const dragFolderElIndex = serverEl.indexOf(dragFolderElId);
            const dragElLength = dragElData.isOpen
                ? dragElData.serverId.length + 1
                : 1;

            const {
                maskPart,
                hoverElId: dropElId,
                folderElId: dropFolderElId,
                isLastOfFolder: isLastOfDropFolder,
            } = hoverMaskState;
            const dropElData = serverElState[dropElId];
            const isDropFolderOpen =
                dropFolderElId && serverElState[dropFolderElId].isOpen;
            const inDropFolder = !!dropFolderElId;
            const isDropFolder = dropElId === dropFolderElId;
            const isDropItemInFolder = inDropFolder && !isDropFolder;
            const dropElIndex =
                serverEl.indexOf(dropElId) + (maskPart === "bottom" ? 1 : 0);
            const dropFolderElIndex = serverEl.indexOf(dropFolderElId);

            /*  
                Folder to not isDropItemInFolder
                Folder top equal item move
                Item to top
                Item to bottom with isLastOfDropFolder
                Item to Folder bottom 
            */
            const moveType = (() => {
                if (maskPart === "top") {
                    if (isDragFolder ? !isDropItemInFolder : true) {
                        console.log("top", isDragFolder, isLastOfDropFolder);
                        return "swap";
                    }
                } else if (maskPart === "bottom") {
                    if (!isDragFolder && isLastOfDropFolder) {
                        return "swap";
                    }
                    if (!isDragFolder && isDropFolder) {
                        return "insertFolder";
                    }
                    if (!isDragFolder && !isDropFolder && !isDropItemInFolder) {
                        return "createFolder";
                    }
                } else if (maskPart === "last") {
                    return "insertLast";
                }
            })();

            let targetIndex, sourceIndex, dropFolderServerId;
            switch (moveType) {
                case "swap":
                    console.log(
                        "###### Can Swap",
                        "dragElIndex",
                        dragElIndex,
                        "dropElIndex",
                        dropElIndex,
                        "dragElLength",
                        dragElLength
                    );
                    swap(
                        state.serverEl,
                        dragElIndex,
                        dropElIndex,
                        dragElLength
                    );

                    targetIndex = dropElIndex - dropFolderElIndex - 1;
                    sourceIndex = dragElIndex - dragFolderElIndex - 1;
                    if (isDragItemInFolder) {
                        // 來自資料夾
                        console.log("### 來自資料夾");
                        if (
                            !isDropFolder &&
                            dragFolderElId === dropFolderElId
                        ) {
                            // 同資料夾移動
                            console.log("### Move same Folder");
                            swap(
                                serverElState[dropFolderElId].serverId,
                                sourceIndex,
                                targetIndex,
                                1
                            );
                        } else if (!isDropFolder && dropFolderElId) {
                            // 不同資料夾移動
                            console.log("### Move diff Folder");
                            remove(
                                serverElState[dragFolderElId].serverId,
                                sourceIndex
                            );
                            insert(
                                serverElState[dropFolderElId].serverId,
                                targetIndex,
                                dragServerId[0]
                            );
                            serverElState[dragElId].folderElId = dropFolderElId;
                        } else {
                            // 從資料夾移出
                            console.log("### Remove from Folder");
                            remove(
                                serverElState[dragFolderElId].serverId,
                                sourceIndex
                            );
                            serverElState[dragElId].folderElId = false;
                        }
                    } else {
                        console.log("### 不來自資料夾");
                        if (isDropItemInFolder) {
                            // 移進資料夾
                            console.log("### Move item to Folder");
                            serverElState[dragElId].folderElId = dropFolderElId;
                            insert(
                                serverElState[dropFolderElId].serverId,
                                targetIndex,
                                dragServerId[0]
                            );
                        }
                    }

                    break;
                case "insertFolder":
                    dropFolderServerId = serverElState[dropFolderElId].serverId;
                    if (isDragItemInFolder) {
                        const dragFolderServerId =
                            serverElState[dragFolderElId].serverId;
                        console.log(
                            "從資料夾移除",
                            dragElIndex,
                            dragFolderElIndex
                        );
                        sourceIndex = dragElIndex - dragFolderElIndex - 1;
                        console.log([...dragFolderServerId]);
                        remove(dragFolderServerId, sourceIndex);
                        console.log([...dragFolderServerId]);
                    }
                    insert(
                        dropFolderServerId,
                        dropFolderServerId.length,
                        dragServerId[0]
                    );
                    if (isDropFolderOpen) {
                        console.log(
                            "純換 EL",
                            dropFolderElIndex,
                            dropFolderServerId.length
                        );
                        targetIndex =
                            dropFolderElIndex + dropFolderServerId.length;
                        const offsetIndex =
                            targetIndex +
                            (dropFolderElIndex > dragElIndex ? -1 : 0);
                        console.log([...serverEl]);
                        remove(serverEl, dragElIndex);
                        console.log([...serverEl]);
                        insert(serverEl, offsetIndex, dragElId);
                        console.log([...serverEl]);
                    } else {
                        console.log("刪除 EL");
                        remove(serverEl, dragElIndex);
                    }
                    serverElState[dragElId].folderElId = dropFolderElId;
                    console.log("##### insert Folder");
                    break;
                case "insertLast":
                    if (isDragItemInFolder) {
                        const dragFolderServerId =
                            serverElState[dragFolderElId].serverId;
                        sourceIndex = dragElIndex - dragFolderElIndex - 1;
                        remove(dragFolderServerId, sourceIndex);
                    }
                    const lastIndex = serverEl.length - 1;
                    remove(serverEl, dragElIndex);
                    insert(serverEl, lastIndex, dragElId);

                    serverElState[dragElId].folderElId = false;
                    console.log("##### insert Last");
                    break;
                case "createFolder":
                    if (dragFolderElId) {
                        const dragFolderServerId =
                            serverElState[dragFolderElId].serverId;
                        remove(
                            dragFolderServerId,
                            dragFolderServerId.indexOf(dragServerId[0])
                        );
                        console.log([...dragFolderServerId]);
                    }
                    targetIndex =
                        dropElIndex -
                        1 +
                        (dropElIndex - 1 > dragElIndex ? -1 : 0);
                    remove(serverEl, dragElIndex);
                    remove(serverEl, targetIndex);

                    const serverElId = [];
                    for (let key in serverElState) {
                        serverElId.push(key);
                    }
                    const newFolderId = createFolderId(serverElId);
                    serverElState[newFolderId] = {
                        serverId: [dropElData.serverId[0], dragServerId[0]],
                        serverElId: newFolderId,
                        folderElId: newFolderId,
                        isFolder: true,
                        isOpen: false,
                    };
                    serverElState[dragElId].folderElId = newFolderId;
                    serverElState[dropElId].folderElId = newFolderId;
                    insert(serverEl, targetIndex, newFolderId);
                    console.log("##### Create Folder");
                    break;
                default:
                    console.log("##### undefined Type");
            }

            // 移除空資料夾
            if (
                dragFolderElId &&
                serverElState[dragFolderElId].serverId.length === 0
            ) {
                console.log("### remove Folder");
                const currentDragFolderIndex = serverEl.indexOf(dragFolderElId);
                remove(state.serverEl, currentDragFolderIndex);
                delete serverElState[dragFolderElId];
            }
        },
        toggleFolder: (state, action) => {
            const { serverEl, serverElState } = state;
            const serverElId = action.payload;
            const { isOpen, serverId } = serverElState[serverElId];
            const newIsOpen = !isOpen;
            const serverElIndex = serverEl.indexOf(serverElId);
            const serverElStateLength = Object.keys(state.serverElState).length;

            serverElState[serverElId].isOpen = newIsOpen;
            if (newIsOpen) {
                let elIdBase = serverElStateLength + 1;
                let newElIndex = serverElIndex;
                serverId.forEach((serverId, index) => {
                    const elId = findElIdByDataId(serverElState, serverId);
                    const newElId = elIdBase + index;
                    if (elId === -1) {
                        serverElState[newElId] = {
                            serverId: [serverId],
                            serverElId: serverElId,
                            folderElId: false,
                            isFolder: false,
                            isOpen: false,
                        };
                        serverEl.splice(newElIndex + 1, 0, newElId);
                    } else {
                        serverEl.splice(newElIndex + 1, 0, elId);
                    }
                    newElIndex++;
                });
            } else {
                let elIndex = serverElIndex + 1;
                let deleteCount = serverId.length;
                while (deleteCount > 0) {
                    serverEl.splice(elIndex, 1);
                    deleteCount--;
                }
            }
            console.log("toggleFolder", action.payload, [...state.serverEl]);
            // for (let i in state.serverElState) {
            //     let v = serverElState[i];
            //     console.log([...v.serverId], { ...v });
            // }
        },
    },
});

export const {
    setActiveServerElId,
    setActiveChannelId,
    serverElMove,
    toggleFolder,
} = serverSlice.actions;

export const getFirstOpenApp = (state) => state.server.firstOpenApp;
export const getUserData = (userNameTag) => (state) =>
    state.server.userData[userNameTag];

export const getServerEl = (state) => state.server.serverEl;
export const getServerElData = (state) => state.server.serverElState;
export const getServerDataByIndex = (index) => (state) => {
    const serverEl = state.server.serverEl;
    const serverElId = serverEl[index];
    const serverElState = state.server.serverElState[serverElId];
    const serverData = state.server.serverData;
    const serverIds = serverElState.serverId;
    const rawServerData = serverIds.map((serverId) => serverData[serverId]);
    const processedServerData = processedServerResult(rawServerData);
    return { serverElState, serverData: processedServerData };
};
export const getServerDataByMe = (state) => {
    return state.server.serverElState["@me"];
};
export const checkInFolder = (targetServerElId) => (state) => {
    const serverElState = state.server.serverElState;
    return serverElState[targetServerElId].folderElId;
};
export const getIsActiveServer = (elId) => (state) => {
    const { serverElState, activeServerElId } = state.server;
    const { serverId, isOpen, isFolder } = serverElState[elId];
    if (!serverElState[activeServerElId]) return false;
    const activeServerId = serverElState[activeServerElId].serverId[0];
    let isActive = activeServerElId === elId;
    if (isFolder && !isOpen) {
        isActive = serverId.includes(activeServerId);
    }
    return isActive;
};
export const getActiveServerElId = (state) => state.server.activeServerElId;
export const getActiveServerData = (state) => {
    const { activeServerElId, serverElState, serverData } = state.server;
    const serverId = serverElState[activeServerElId].serverId[0];

    return serverData[serverId] || { serverName: "" };
};

function processedServerResult(serverResult) {
    return serverResult.reduce(
        (currData, prevData) => {
            const { serverName, serverIcon, showNotice, noticeCount } =
                prevData;
            const newData = { ...currData };
            newData.serverNames.push(serverName);
            newData.serverIcons.push(serverIcon);
            newData.noticeCount += noticeCount;
            newData.showNotice = currData.showNotice || showNotice;
            return newData;
        },
        { serverNames: [], serverIcons: [], showNotice: false, noticeCount: 0 }
    );
}
function createFolderId(idList) {
    const newId = [...`${Math.random()}`].splice(2, 9).join("");
    return idList.includes(newId) ? createFolderId(idList) : newId;
}

export default serverSlice.reducer;

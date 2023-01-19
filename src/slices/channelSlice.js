import { createSlice } from "@reduxjs/toolkit";
import { swap, remove, insert, findElIdByDataId } from "../utils/funciton";

const initialState = {
    activeChannelId: null,
    channelEl: ["1", "3", "99", "2", "4", "98", "5", "6"],
    channelElState: {
        1: {
            channelId: ["11"],
            channelElId: "1",
            folderElId: false,
            isFolder: false,
            isOpen: false,
        },
        2: {
            channelId: ["12"],
            channelElId: "2",
            folderElId: "99",
            isFolder: false,
            isOpen: false,
        },
        99: {
            channelId: ["199", "12", "14"],
            channelElId: "99",
            folderElId: "99",
            isFolder: true,
            isOpen: true,
        },
        3: {
            channelId: ["13"],
            channelElId: "3",
            folderElId: false,
            isFolder: false,
            isOpen: false,
        },
        4: {
            channelId: ["14"],
            channelElId: "4",
            folderElId: "99",
            isFolder: false,
            isOpen: false,
        },
        98: {
            channelId: ["198", "15", "16"],
            channelElId: "98",
            folderElId: "98",
            isFolder: true,
            isOpen: true,
        },
        5: {
            channelId: ["15"],
            channelElId: "5",
            folderElId: "98",
            isFolder: false,
            isOpen: false,
        },
        6: {
            channelId: ["16"],
            channelElId: "6",
            folderElId: "98",
            isFolder: false,
            isOpen: false,
        },
    },
    channelData: {
        11: {
            channelName: "11 測試文字頻道",
            type: "text",
            showNotice: true,
            noticeCount: 1,
        },
        12: {
            channelName: "12 測試語音頻道",
            type: "voice",
            showNotice: false,
            noticeCount: 0,
        },
        13: {
            channelName: "13 測試文字頻道",
            type: "text",
            showNotice: true,
            noticeCount: 3,
        },
        14: {
            channelName: "14 測試語音頻道",
            type: "voice",
            showNotice: false,
            noticeCount: 0,
        },
        199: {
            channelName: "資訊",
            type: "folder",
            showNotice: false,
            noticeCount: 0,
        },
        15: {
            channelName: "15 文字",
            type: "text",
            showNotice: true,
            noticeCount: 3,
        },
        16: {
            channelName: "16 語音",
            type: "voice",
            showNotice: false,
            noticeCount: 0,
        },
        198: {
            channelName: "資訊 2",
            type: "folder",
            showNotice: false,
            noticeCount: 0,
        },
    },
};

export const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setActiveChannelId: (state, action) => {
            state.activeChannelId = action.payload;
        },
        channelElMove: (state, action) => {
            const { channelEl, channelElState, channelData } = state;

            const { dragState, dropState } = action.payload;
            const { dragElId, dragType, dragIndex, dragFolderElId } = dragState;
            const {
                dropElId,
                dropType,
                dropFolderElId,
                dropIndex,
                dropDirection,
                canDrop,
            } = dropState;
            const dragElState = channelElState[dragElId];
            const { dragChannelId } = dragElState;
            const dropElState = channelElState[dropElId];

            /*
                sameType    依照上下插入 上 n 下 n+1
                to Folder   上 插入 prevFolder 對應的 type last
                            下 插入 folder 對應的 tpye first
            */

            let dragTextElId = {};
            let dragVoiceElId = {};
            for (let index = 0; index < channelEl.length; index++) {
                const elId = channelEl[index];
                const elState = channelElState[elId];

                // 需要迭代出所有的 text 與 voice 做後續處理
                const elData = channelElState[elState].channelId[0];
            }

            if (dropType === "folder") {
                if (dropDirection === "top") {
                    const prevElId = channelEl[dropIndex - 1];
                    if (!prevElId) return;
                    const { channelId, folderElId } = channelElState[prevElId];

                    if (folderElId) {
                        dragElState.folderElId = folderElId;
                        insert(dragChannelId, channelId, 1);
                    }
                } else {
                }
            }
        },
        folderToggle: (state, action) => {
            const folderElId = action.payload;
            const { channelElState, channelData, channelEl } = state;

            const folderElIndex = channelEl.indexOf(folderElId);
            const { isOpen, channelId } = channelElState[folderElId];
            const [folderId, ...otherChannelId] = channelId;

            const newIsOpen = !isOpen;
            channelElState[folderElId].isOpen = newIsOpen;

            if (newIsOpen) {
                let elIdBase = channelElState.length + 1;
                let newElIndex = folderElIndex;
                let offsetIndex = 0;
                otherChannelId.forEach((channelId, index) => {
                    const elId = findElIdByDataId(channelElState, channelId);
                    const elIndex = channelEl.indexOf(elId);
                    const newElId = elIdBase + index;
                    if (elId === -1) {
                        const newChannelElData = {
                            channelId: [channelId],
                            channelElId: folderId,
                            folderElId: false,
                            isFolder: false,
                            isOpen: false,
                        };
                        channelElState[newElId] = newChannelElData;
                        channelEl.splice(newElIndex + 1, 0, newElId);
                    } else if (elIndex === -1) {
                        channelEl.splice(newElIndex + offsetIndex + 1, 0, elId);
                    } else {
                        // elIndex 存在則位移一格
                        offsetIndex++;
                    }
                    newElIndex++;
                });
            } else {
                const removeEl = otherChannelId.filter((channelId) => {
                    const { showNotice, noticeCount } = channelData[channelId];
                    return !showNotice && noticeCount === 0;
                });
                // console.log("removeIndex", [...channelEl]);
                // console.log("removeIndex", removeEl);
                const removeElIdIndex = removeEl
                    .map((targetChannelId) => {
                        const elId = Object.keys(channelElState).find(
                            (elId) => {
                                const { channelId, isFolder } =
                                    channelElState[elId];
                                if (isFolder) return false;
                                return targetChannelId === channelId[0];
                            }
                        );
                        return channelEl.indexOf(elId);
                    })
                    .reverse();
                // console.log("removeIndex", removeElIdIndex);
                removeElIdIndex.forEach((removeIndex) => {
                    // console.log(
                    //     "removeIndex",
                    //     removeIndex,
                    //     channelEl[removeIndex]
                    // );
                    remove(channelEl, removeIndex);
                });
            }
        },
    },
});

export const { channelElMove, folderToggle } = channelSlice.actions;

export const getChannelEl = (state) => state.channel.channelEl;
export const getChannelElState = (state) => state.channel.channelElState;
export const getChannelData = (state) => state.channel.channelData;
export const getChannelByIndex = (index) => (state) => {
    const { channelEl, channelElState, channelData } = state.channel;
    const targetElId = channelEl[index];
    const targetElState = channelElState[targetElId];
    const { isFolder } = targetElState;
    const targetChannelId = targetElState.channelId;
    let targetData = {};
    // if (isFolder) {
    //     // 改
    //     targetData = channelData[targetChannelId[0]];
    // } else {
    targetData = channelData[targetChannelId[0]];
    // }
    return { channelElState: targetElState, channelData: targetData };
};
export const getActiveChannelId = (state) => state.channel.activeChannelId;

export default channelSlice.reducer;

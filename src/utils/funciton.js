export function swap(array, sourceIndex, targetIndex, swapLength) {
    const offsetIndex =
        targetIndex + (targetIndex > sourceIndex ? -swapLength : 0);
    array.splice(offsetIndex, 0, ...array.splice(sourceIndex, swapLength));
}
export function remove(array, removeIndex, removeLength = 1) {
    return array.splice(removeIndex, removeLength);
}
export function insert(array, insertIndex, ...insertItem) {
    array.splice(insertIndex, 0, ...insertItem);
}

export function findElIdByDataId(elState, targetDataId) {
    if (arguments.length < 2)
        throw new Error("Missing a argument : elState , targetDataId");
    const targetState = elState;
    const elId = Object.keys(targetState).find((elId) => {
        const elData = targetState[elId];
        const { channelId, serverId, isFolder } = elData;
        const sourceDataId = channelId || serverId;
        // console.log("findElIdByDataId", elId, channelId, serverId, elState);
        if (isFolder) return false;
        return sourceDataId[0] === targetDataId;
    });
    return elId;
}

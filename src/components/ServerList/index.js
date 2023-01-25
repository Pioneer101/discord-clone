import ServerItem from "../ServerItem";
import { getServerEl, getServerElData } from "../../slices/serverSlice";
import { useSelector } from "react-redux";
import FolderAccordion from "../FolderAccordion";
import ServerItemButton from "../ServerItemJoinButton";
import useDrag from "../../hooks/useDrag";
import usePageRouter from "../../hooks/usePageRouter";

function ServerList(props) {
    const serverEl = useSelector(getServerEl);
    const serverElState = useSelector(getServerElData);
    const drag = useDrag(serverElState);
    usePageRouter();

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

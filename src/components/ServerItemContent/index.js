import styled from "styled-components";
import IconFolder from "../IconFolder";
import ServerNoticeCounter from "../ServerNoticeCounter";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveServerElId, toggleFolder } from "../../slices/serverSlice";

export const ItemLink = styled.div`
    z-index: 1;
    display: flex;
    font-weight: 500;
    line-height: 1.2em;
    white-space: nowrap;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    transition: all 0.05s;
`;
export const ItemContent = styled.div`
    overflow: hidden;
`;
export const ItemGrid = styled.div``;

export const Wapper = styled.label`
    z-index: 1;
    background: ${(props) => props.theme.bg_primary};
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    font-size: 100%;
    height: 48px;
    transition: background 0.1s, border-radius 0.1s, height 0.1s ease-out,
        width 0.1s ease-out;
    white-space: nowrap;
    width: 48px;
    cursor: pointer;

    &::after {
        content: "";
        transition: background 0.2s;
    }
    &:active {
        transform: translateY(1px);
    }
`;

function ServerItemContent(props) {
    const dispatch = useDispatch();

    const { serverElState, serverData, drag, isItemInFolder } = props;
    const { handleDragStart } = drag.handle;
    const { serverNames, noticeCount } = serverData;
    const { isOpen, isFolder, serverElId } = serverElState;
    const serverLink = (() => {
        const serverNameLength = serverNames.length;
        const linkLimit = serverNameLength < 4 ? serverNameLength : 4;
        const serverLinkEls = [];
        for (let index = 0; index < linkLimit; index++) {
            // const serverName = processServerName(serverNames[index]); // 上線在拿回來
            const serverName = serverNames[index];
            serverLinkEls.push(
                <ItemLink key={`room-${serverName}`}>{serverName}</ItemLink>
            );
        }
        return serverLinkEls;
    })();

    const handleServerItemClick = () => {
        if (isFolder) {
            dispatch(toggleFolder(serverElId));
        } else {
            dispatch(setActiveServerElId(serverElId));
        }
    };

    return (
        <Wapper
            data-id={serverElId}
            draggable={true}
            onClick={handleServerItemClick}
            onDragStart={handleDragStart}
        >
            <ServerNoticeCounter
                serverElId={serverElId}
                noticeCount={noticeCount}
                isItemInFolder={isItemInFolder}
            />
            <ItemContent>
                {isFolder && <IconFolder isOpen={isOpen} />}
                <ItemGrid>{serverLink}</ItemGrid>
            </ItemContent>
        </Wapper>
    );
}

function processServerName(serverName) {
    let arr = [...serverName];
    let length = [...arr].length - 1;
    for (let i = 0; i < length; i++) {
        const reg = RegExp(/[a-zA-Z0-9]/);
        const match = !!reg.exec(arr[i]) && !!reg.exec(arr[i + 1]);
        if (match) {
            arr.splice(i + 1, 1);
            i--;
            length--;
        }
    }
    return arr.join("");
}

export default ServerItemContent;

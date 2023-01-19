import { Outlet } from "react-router";
import ServerSideBar from "../../components/ServerSideBar";

import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getActiveServerElId } from "../../slices/serverSlice";
import { useEffect } from "react";
// function usePageListener() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     let { serverId, channelId } = useParams();
//     let activeServerId = useSelector(getActiveServerId);
//     let processedserverId = activeServerId.replace("serverItem-", "");
//     console.log('usePageListener',serverId, channelId, processedserverId);
//     useEffect(() => {
//         if (processedserverId === "@me" && serverId !== processedserverId) {
//             dispatch(setActiveServerId(`serverItem-${serverId}`));
//         } else {
//             navigate(`/channels/${processedserverId}`, { replace: true });
//         }
//     }, [processedserverId]);
// }
function usePageListener() {
    const navigate = useNavigate();
    let { serverId, channelId } = useParams();
    let activeServerId = useSelector(getActiveServerElId);
    console.log("usePageListener", serverId, channelId, activeServerId);
    useEffect(() => {
        navigate(`/channels/${activeServerId}`, { replace: true });
    }, [activeServerId]);
}

function ServerLayout() {
    usePageListener();
    return (
        <>
            <ServerSideBar />
            <Outlet />
        </>
    );
}

export default ServerLayout;

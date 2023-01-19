import { Outlet } from "react-router";
import ServerSideBar from "../../components/ServerSideBar";

import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getActiveServerElId, getFirstOpenApp } from "../../slices/serverSlice";
import { useEffect } from "react";

// 路由控制
function usePageListener() {
    const navigate = useNavigate();
    let { serverId, channelId } = useParams();
    let activeServerId = useSelector(getActiveServerElId);
    let firstOpenApp = useSelector(getFirstOpenApp);
    console.log("usePageListener", serverId, channelId, activeServerId);
    useEffect(() => {
        if (firstOpenApp) {
            navigate(`/channels/@me`, { replace: true });
        } else {
            navigate(`/channels/${activeServerId}`, { replace: true });
        }
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

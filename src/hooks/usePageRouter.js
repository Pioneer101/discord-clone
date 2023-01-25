import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
    getActiveServerElId,
    getFirstOpenApp,
    setActiveServerElId,
} from "../slices/serverSlice";

export default function usePageRouter() {
    const dispatch = useDispatch();
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

    useEffect(() => {
        dispatch(setActiveServerElId(serverId));
    }, [serverId, channelId]);
}

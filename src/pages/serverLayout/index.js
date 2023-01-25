import { Outlet } from "react-router";
import ServerSideBar from "../../components/ServerSideBar";

function ServerLayout() {
    return (
        <>
            <ServerSideBar />
            <Outlet />
        </>
    );
}

export default ServerLayout;

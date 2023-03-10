import { Routes, Route, HashRouter } from "react-router-dom";
import { useNavigate, useParams } from "react-router";
import ChatArea from "../components/ChatArea";
import ServerLayout from "../pages/serverLayout";
import BaseLayout from "../pages/baseLayout";
import NotFoundPage from "../pages/notFoundPage";

function AppRoute() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<ServerLayout />}>
                    <Route path="channels" element={<BaseLayout />}>
                        <Route path=":serverId" element={<BaseLayout />}>
                            <Route path=":channelId" element={<ChatArea />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default AppRoute;

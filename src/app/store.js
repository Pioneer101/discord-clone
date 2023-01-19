import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/themeSlice";
import serverReducer from "../slices/serverSlice";
import channelReducer from "../slices/channelSlice";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        server: serverReducer,
        channel: channelReducer,
    },
});

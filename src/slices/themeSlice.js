import { createSlice } from "@reduxjs/toolkit";
import { darkTheme, lightTheme } from "../theme/";

const initialState = {
    theme: darkTheme,
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = darkTheme ? lightTheme : darkTheme;
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.theme;

export default themeSlice.reducer;

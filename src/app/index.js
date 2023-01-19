import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import ModalLayout from "../pages/modalLayout";

import AppRoute from "../routers";
import { selectTheme } from "../slices/themeSlice";

export const AppWapper = styled.div`
    display: grid;
    grid-template-areas: "server room chat";
    grid-auto-columns: 72px 240px 1fr;
    height: 100vh;
    overflow: hidden;
`;

const GlobalStyle = createGlobalStyle`
    body{
        overflow: hidden;
    }
    * {
        color: #dcddde;
    }
`;

function App() {
    const theme = useSelector(selectTheme);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <AppWapper>
                <AppRoute />
            </AppWapper>
            <ModalLayout />
        </ThemeProvider>
    );
}

export default App;

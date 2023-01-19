import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getActiveServerData } from "../../slices/serverSlice";
import IconDropDown from "../IconDropDown";

const TitleWapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Header = styled.h1`
    margin: 0px;
    min-width: 186px;
    max-width: 186px;
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;
const Button = styled.div`
    display: flex;
    flex: 1 1 auto;
    width: 22px;
    height: 21px;
    margin-left: 4px;
`;

export const Wapper = styled.header`
    display: flex;
    box-sizing: border-box;
    flex: 0 0 48px;
    width: 100%;
    cursor: pointer;
    align-items: center;
    padding-left: 16px;
    box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
        0 2px 0 rgba(4, 4, 5, 0.05);
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.bg_modifier_hover};
    }
`;

function ServerTitle() {
    const { serverName = "" } = useSelector(getActiveServerData);
    return (
        <Wapper>
            <TitleWapper>
                <Header>{serverName}</Header>
                <Button>
                    <IconDropDown />
                </Button>
            </TitleWapper>
        </Wapper>
    );
}

export default ServerTitle;

import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getUserData } from "../../slices/serverSlice";
import AvatarPanel from "../AvatarPanel";
import IconSet from "../IconSet";
import NameTagPanel from "../NameTagPanel";
import PanelButton from "../PanelButton";

const ControllPanel = styled.div`
    display: flex;
`;

export const Wapper = styled.section`
    flex: 0 1 52px;
    display: flex;
    width: 100%;
    padding: 0 8px;
    margin-bottom: 1px;
    box-sizing: border-box;
    align-items: center;
    background-color: ${(props) => props.theme.bg_secondary_alt};
`;

function UserPanel() {
    const { userName, hashTag, avatarSrc } = useSelector(getUserData("me"));

    return (
        <Wapper>
            <AvatarPanel avatarSrc={avatarSrc} />

            <NameTagPanel userName={userName} hashTag={hashTag} />
            <ControllPanel>
                <PanelButton role="button" ariaLabel="拒聽">
                    <IconSet name="mic" />
                </PanelButton>
                <PanelButton role="button" ariaLabel="靜音">
                    <IconSet name="headphone" />
                </PanelButton>
                <PanelButton role="button" ariaLabel="使用者設定">
                    <IconSet name="setting" />
                </PanelButton>
            </ControllPanel>
        </Wapper>
    );
}

export default UserPanel;

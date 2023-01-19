import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
    getIsActiveServer,
    getServerDataByMe,
    setActiveServerElId,
} from "../../slices/serverSlice";
import LogoSVG from "../IconLogo";

const ServerItemNotice = styled.div`
    background: ${(props) => props.theme.header_primary};
    position: absolute;
    width: 0px;
    height: 8px;
    opacity: 0;
    border-radius: 0 4px 4px 0;
    transform: translate(-36px, -1px);
    transition: height 0.2s, width 0.2s, opacity 0.2s;
`;

export const Wapper = styled.a`
    background: ${(props) => props.theme.bg_primary};
    position: relative;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    outline: 0;
    border-radius: 50%;
    opacity: 1;
    cursor: pointer;
    transition: opacity 0.2s, border-radius 0.2s, background 0.2s;

    &.active,
    &:hover {
        background: ${(props) => props.theme.brand_normal};
        border-radius: 33%;
        path {
            color: ${(props) => props.theme.header_primary};
        }
    }
    &.active {
        ${ServerItemNotice} {
            opacity: 1;
            width: 8px;
            height: 40px;
            transform: translate(-36px, 0px);
        }
    }
    &:hover {
        &:not(.active) > ${ServerItemNotice} {
            opacity: 1;
            width: 8px;
            height: 20px;
        }
    }
    &:active {
        transform: translate(0px, 1px);
        ${ServerItemNotice} {
            transform: translate(-36px, -1px);
        }
    }
`;

function ServerItemMe(props) {
    const { noticeCount } = useSelector(getServerDataByMe);
    const dispatch = useDispatch();
    const isActive = useSelector(getIsActiveServer("@me"));
    const wapperClass = (() => {
        let className = "";
        if (isActive) className += "active ";
        return className;
    })();
    return (
        <>
            <Wapper
                className={wapperClass}
                role="treeItem"
                aria-label="私人訊息"
                onClick={() => dispatch(setActiveServerElId("@me"))}
            >
                <ServerItemNotice showNotice={1} />
                <LogoSVG />
            </Wapper>
        </>
    );
}

export default ServerItemMe;

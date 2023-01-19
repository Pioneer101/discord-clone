import styled from "styled-components";

const SVG = styled.svg`
    z-index: 3;
    width: 24px;
    height: 24px;
    & path {
        color: ${(props) => props.theme.fl_normal};
        transition: opacity 0.1s;
    }
`;

export const Wapper = styled.div`
    /* z-index: 0; */
    align-items: center;
    display: flex;
    justify-content: center;
    overflow: hidden;
    margin-top: -48px;
    min-height: 48px;
    width: 48px;
    transition: margin-top 0.2s;

    &.opening {
        margin-top: 0px;
    }
`;

function IconFolder(props) {
    return (
        <Wapper className={props.isOpen ? "opening" : ""}>
            <SVG viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M20 7H12L10.553 5.106C10.214 4.428 9.521 4 8.764 4H3C2.447 4 2 4.447 2 5V19C2 20.104 2.895 21 4 21H20C21.104 21 22 20.104 22 19V9C22 7.896 21.104 7 20 7Z"
                ></path>
            </SVG>
        </Wapper>
    );
}

export default IconFolder;

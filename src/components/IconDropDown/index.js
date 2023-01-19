import styled from "styled-components";

const Wapper = styled.svg`
    position: relative;
    top: 3px;
    path {
        stroke-width: 2px;
        stroke-dasharray: 7;
        stroke-dashoffset: 1;
        -webkit-transition: stroke-dasharray 0.2s ease;
        transition: stroke-dasharray 0.2s ease;
    }
`;

function IconDropDown() {
    return (
        <Wapper width="18" height="18">
            <g fill="none" fillRule="evenodd">
                <path d="M0 0h18v18H0"></path>
                <path
                    stroke="currentColor"
                    d="M4.5 4.5l9 9"
                    strokeLinecap="round"
                ></path>
                <path
                    stroke="currentColor"
                    d="M13.5 4.5l-9 9"
                    strokeLinecap="round"
                ></path>
            </g>
        </Wapper>
    );
}

export default IconDropDown;

import styled from "styled-components";

const Wapper = styled.svg`
    path {
        color: ${(props) => props.theme.brand_positive};
        transition: color 0.3s;
    }
`;

function IconJoin() {
    return (
        <Wapper width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"
            ></path>
        </Wapper>
    );
}

export default IconJoin;

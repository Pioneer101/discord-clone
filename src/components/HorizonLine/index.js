/*
 * @Author: your name
 * @Date: 2021-04-27 17:27:27
 * @LastEditTime: 2021-04-27 17:32:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dev-box\src\common\components\HorizonLine.js
 */

import styled from "styled-components";

const HorizonWapper = styled.span`
    position: relative;
    margin: 0px 0 0px;
    display: flex;
    justify-content: center;
`;
const HorizonMain = styled.span`
    height: 2px;
    width: ${({ width }) => `${width}`};
    border-radius: 1px;
    background-color: hsla(0, 0%, 100%, 0.06);
`;

function HorizonLine({ width }) {
    return (
        <HorizonWapper>
            <HorizonMain width={width} />
        </HorizonWapper>
    );
}

export default HorizonLine;

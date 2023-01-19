import React from "react";
import styled from "styled-components";

const toolTipStyle = {
    button: {
        pointer: {
            top: "",
            left: "50% ",
        },
        container: {
            "font-size": 14,
            "line-height": 16,
            "font-weight": 400,
        },
        wapper: {
            transform: "translate(-50%, 0)",
        },
    },
    treeItem: {
        pointer: {
            top: "calc(50% - 4px)",
            left: "",
        },
        container: {
            "font-size": 16,
            "line-height": 20,
            "font-weight": 600,
        },
        wapper: {
            transform: "translate(0%, -50%)",
        },
    },
};

const ToolTipPointer = styled.div`
    z-index: 99;
    position: absolute;
    top: ${(props) => props.roleStyle["top"]};
    left: ${(props) => props.roleStyle["left"]};
    width: 0;
    height: 0;
    margin-left: ${(props) => props.marginLeft}px;
    margin-top: ${(props) => props.marginTop}px;
`;
const PointerTreeItem = styled(ToolTipPointer)`
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 4px solid ${(props) => props.theme.bg_floating};
`;
const PointerButton = styled(ToolTipPointer)`
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${(props) => props.theme.bg_floating};
    transform: ${(props) =>
        props.marginTop && props.role === "button" ? "rotate(180deg)" : ""};
`;
const ToolTipContainer = styled.div`
    z-index: 99;
    position: relative;
    font-size: ${(props) => props.roleStyle["font-size"]}px;
    line-height: ${(props) => props.roleStyle["line-height"]}px;
    font-weight: ${(props) => props.roleStyle["font-weight"]};
    max-width: 190px;
    border-radius: 4px;
    background: ${(props) => props.theme.bg_floating};
    box-shadow: ${(props) => props.theme.elevation_high};
    top: ${(props) => props.top}px;
    left: ${(props) => props.left}px;
    word-wrap: break-word;
    padding: 8px 12px;
`;
const Wapper = styled.div`
    z-index: 99;
    position: absolute;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    transform: ${(props) => props.roleStyle["transform"]};
`;

function ToolTipDialog(props) {
    const { label, targetElement, role } = props;
    const { x, y, width, height } = targetElement.getBoundingClientRect();
    const { width: maxWidth, height: maxHeight } =
        document.body.getBoundingClientRect();

    const getOffsetPosition = () => {
        let wapperX = 0,
            wapperY = 0,
            containerLeft = 0,
            containerTop = 0,
            pointerLeft = 0,
            pointerTop = 0;

        let dialogWidth, dialogHeight, marginX, marginY;
        switch (role) {
            case "treeItem":
                dialogHeight = 36;
                marginX = 18;
                marginY = 8;

                wapperX = pointerLeft = x + width + marginX;
                pointerLeft = -4;

                wapperY = y + height / 2;
                if (wapperY + dialogHeight / 2 > maxHeight) {
                    containerTop = -(wapperY - maxHeight + height / 2);
                } else if (wapperY - dialogHeight / 2 < 0) {
                    containerTop = -wapperY + height / 2;
                }
                break;
            case "button":
                dialogHeight = 32;
                dialogWidth = 48;
                marginY = 6;

                wapperX = x + width / 2;
                pointerLeft = -4;

                wapperY = y - dialogHeight - marginY;
                if (wapperY - dialogHeight / 2 < 0) {
                    // 超出上方改成朝下
                    containerTop = -wapperY + y + height + marginY;
                    pointerTop = -wapperY + height - dialogHeight / 2 - 2;
                }
                // if (wapperX + dialogWidth / 2 > maxWidth) {
                //     // 超出右方往左+8px定位
                //     containerLeft = -(maxWidth - wapperX + 16);
                // }
                break;
            default:
        }

        return {
            wapperX,
            wapperY,
            containerLeft,
            containerTop,
            pointerLeft,
            pointerTop,
        };
    };
    const {
        wapperX,
        wapperY,
        containerLeft,
        containerTop,
        pointerLeft,
        pointerTop,
    } = getOffsetPosition();

    return (
        <Wapper
            key={`toolTip-${label}`}
            roleStyle={toolTipStyle[props.role].wapper}
            x={wapperX}
            y={wapperY}
        >
            <ToolTipContainer
                roleStyle={toolTipStyle[props.role].container}
                left={containerLeft}
                top={containerTop}
            >
                {label}
            </ToolTipContainer>
            {role === "treeItem" ? (
                <PointerTreeItem
                    roleStyle={toolTipStyle[props.role].pointer}
                    marginLeft={pointerLeft}
                    marginTop={pointerTop}
                />
            ) : (
                <PointerButton
                    roleStyle={toolTipStyle[props.role].pointer}
                    role={role}
                    marginLeft={pointerLeft}
                    marginTop={pointerTop}
                />
            )}
        </Wapper>
    );
}

export default ToolTipDialog;

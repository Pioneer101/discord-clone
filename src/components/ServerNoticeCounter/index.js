import styled from "styled-components";

export const NoticeBorder = styled.div`
    z-index: 5;
    position: absolute;
    display: ${({ showNotice }) => (showNotice ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    min-width: ${({ digit }) => 23 + 7 * digit}px;
    bottom: -9px;
    right: -7px;
    height: 24px;
    margin: 4px;
    border-radius: 20px;
    background: ${({ theme, isItemInFolder }) =>
        isItemInFolder ? theme.bg_secondary : theme.bg_tertiary};
    transition: opacity 0.2s, transform 0.2s;
`;
export const NoticeMask = styled.div`
    z-index: 4;
    position: absolute;
    display: ${({ showNotice }) => (showNotice ? "flex" : "none")};
    overflow: hidden;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    transition: border-radius 0.1s;
`;
export const NoticeContent = styled.span`
    z-index: 5;
    position: absolute;
    display: ${({ showNotice }) => (showNotice ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    min-width: ${({ digit }) => 16 + 7 * digit}px;
    bottom: -4px;
    right: -4px;
    border-radius: 20px;
    margin: 4px;
    background: ${({ theme }) => theme.brand_danger};
    font-size: 12px;
    font-weight: 600;
    transition: opacity 0.2s, transform 0.2s;

    & > span {
        color: ${({ theme }) => theme.header_primary};
        transform: translate(0, -1px);
    }
`;
export const Wapper = styled.div`
    position: absolute;
    overflow: ${({ isItemInFolder }) =>
        isItemInFolder ? "hidden" : "visible"};
    width: 48px;
    height: 48px;
`;

function ServerNoticeCounter(props) {
    const { noticeCount, isItemInFolder } = props;
    const digit = `${noticeCount}`.length - 1;
    const showNotice = noticeCount > 0;

    return (
        <Wapper isItemInFolder={isItemInFolder}>
            <NoticeContent
                isItemInFolder={isItemInFolder}
                showNotice={showNotice}
                digit={digit}
            >
                <span>{noticeCount}</span>
            </NoticeContent>
            <NoticeMask showNotice={showNotice}>
                <NoticeBorder
                    showNotice={showNotice}
                    isItemInFolder={isItemInFolder}
                    digit={digit}
                />
            </NoticeMask>
        </Wapper>
    );
}

export default ServerNoticeCounter;

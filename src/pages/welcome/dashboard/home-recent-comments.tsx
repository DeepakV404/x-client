import { useContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Avatar, Space, Typography } from "antd";

import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";

import Loading from "../../../utils/loading";
import { useNavigate } from "react-router-dom";
import { RECENT_COMMENTS } from "../../analytics/account-overview/api/analytics-query";
import { NO_RECENT_MESSAGES } from "../../../constants/module-constants";

const { Text }  =   Typography;

const HomeRecentComments = (props: { from: any, to: any }) => {

    const { from, to }          =   props;

    const { $user }             =   useContext(GlobalContext);
    const navigate              =   useNavigate();

    const [_getRecentComments, { data, loading }]     =   useLazyQuery(RECENT_COMMENTS, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if(from && to){
            _getRecentComments({
                variables: {
                    timeSpan: {
                        from    :   from,
                        to      :   to
                    },
                    userUuids: [$user.uuid]
                }
            })
        }
    }, [from, to])

    if(loading) return <div style={{height: "calc(100vh - 350px)"}}><Loading/></div>

    const getComment = (comment: any) => {

        let accountId   =   comment.roomStub.uuid
        let roomId      =   comment.accountStub.uuid

        let users = comment?.metadata?.mentions?.sellerMentions;

        if(users){
            users = users.concat(comment?.metadata?.mentions?.buyerMentions)
        }else{
            users = comment?.metadata?.mentions?.buyerMentions
        }
        
        const findLink = (text: string) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, (url: string) => `<a href="${url}" target="_blank">${url}</a>`);
        };

        let formattedComment = comment.comment.replace(/\{@([bs])#([a-zA-Z0-9-]+)\}/g, function(commentId: string, _: string, parsedId: string) {
            let parsedUser: any = users?.find((seller: any) => seller.uuid === parsedId);
            if(parsedUser) {
                return `<span class="cm-link-text">${CommonUtil.__getFullName(parsedUser.firstName, parsedUser.lastName)}</span>`
            }
            return commentId;
        });

        const parseSection = (comment: string) => {
            return comment.replace(/\{@sec#([a-zA-Z0-9-]+)\}/g, (matchedRegex: any, sectionId: string) => {               
                const sectionName = getSectionName(matchedRegex);
                return sectionName ? `<a class="j-section-name-in-comment" href="#rooms/${roomId}/${accountId}/sections/${sectionId}">${sectionName}</a>`: "#unknown_section"
            });
        };

        const getSectionName = (matchedRegex: string) => { 
            if (comment?.metadata.hasMentionsData) {
                const mentionedSection = comment.metadata.mentions[matchedRegex];
                if (mentionedSection) {
                    return `#${mentionedSection.name}`;
                }
            }
        };

        const parseEveryOneMention = (comment: any) => {
            return comment.replaceAll("@Everyone", () => {               
                return `<span class="cm-link-text">Everyone</span>`
            });
        }

        formattedComment = parseEveryOneMention(parseSection(findLink(formattedComment)));

        return formattedComment;
    };
    
    return(
        <Space direction="vertical" className="cm-width100 cm-height100">
            {
                data && data.recentComments.length > 0
                ?
                    data?.recentComments.map((_comment: any) => (
                        <div key={_comment.uuid} className="j-home-recent-comment">
                            <div>
                                <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex" }} src={_comment?.createdStakeholder?.profileUrl ? <img src={_comment.createdStakeholder.profileUrl} alt={CommonUtil.__getFullName(_comment.createdStakeholder.firstName, _comment.createdStakeholder.lastName)}/> : ""}>
                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_comment.createdStakeholder.firstName, _comment.createdStakeholder.lastName),1)}
                                </Avatar>
                            </div>
                            <div style={{wordBreak: "break-word"}} className="cm-width100">
                                <div className="cm-flex-space-between">
                                    {
                                        $user.uuid === _comment.createdStakeholder.uuid ?
                                            <Text className="cm-font-size13 cm-secondary-text" style={{maxWidth: _comment?.metadata?.actionPoint?.name ? "120px" : "200px"}}>You</Text>
                                        :
                                            <Text className="cm-font-size13 cm-secondary-text" style={{color: "background: #000000D9", maxWidth: "250px"}} ellipsis={{tooltip: CommonUtil.__getFullName(_comment.createdStakeholder.firstName, _comment.createdStakeholder.lastName)}}>{CommonUtil.__getFullName(_comment.createdStakeholder.firstName, _comment.createdStakeholder.lastName)}</Text>
                                    }
                                    {_comment?.metadata?.actionPoint && <Space size={4} className="cm-font-size11 cm-light-text cm-cursor-pointer"  onClick={() => {navigate(`/rooms/${_comment.accountStub.uuid}/${_comment.roomStub.uuid}/collaboration/${_comment.metadata.actionPoint.stage.uuid}?actionPointId=${_comment.metadata.actionPoint.uuid}`)}}><div style={{width: "35px"}}>from</div> <Text className="cm-secondary-text" style={{ maxWidth: "200px"}} ellipsis={{tooltip: _comment?.metadata?.actionPoint?.name}}>{_comment?.metadata?.actionPoint?.name}</Text></Space>}
                                </div>
                                <div className="cm-font-size14 cm-font-fam400 j-comment-text-root" dangerouslySetInnerHTML={{__html: getComment(_comment).replace(/(?:\r\n|\r|\n)/g, '<br>')}}></div>
                                <div className="cm-font-size10">{`${CommonUtil.__getDateDay(new Date(_comment.createdAt))}, ${new Date(_comment.createdAt).getFullYear()}`} - {CommonUtil.__format_AM_PM(_comment.createdAt)}</div>
                            </div>
                        </div>
                    ))
                :
                    <div className="cm-flex-center cm-flex-direction-column" style={{height: "calc(100vh - 200px)", rowGap: "15px"}}>
                        <img src={NO_RECENT_MESSAGES} alt="top_5_deals" width={120}/>
                        <div className="cm-font-opacity-black-65">No recent comments</div>
                    </div>
            }
        </Space>
    )
}

export default HomeRecentComments
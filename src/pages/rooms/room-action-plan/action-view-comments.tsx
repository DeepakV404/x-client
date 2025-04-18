import { Divider } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { PermissionCheckers } from "../../../config/role-permission";
import { FEATURE_ROOMS } from "../../../config/role-permission-config";
import { NO_MESSAGES } from "../../../constants/module-constants";
import { R_ACTION_POINT_COMMENTS } from "../api/rooms-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";
import { ActionPointViewContext } from ".";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import CommentBox from "../../../components/comment-box/comment-box";
import Loading from "../../../utils/loading";
import CommentItem from "./comment-item";

const ActionViewComment = (props: {sellers: any, buyers: any, room?: any, latestMessageId?: any}) => {

    const{ sellers, buyers, room, latestMessageId } = props
    
    const scrollRef: any    =   useRef();
    
    const { roomId }        =   useParams();

    const { $user }         =   useContext(GlobalContext)

    let date 									= 	"";
	let today									=	new Date();
    let yesterday                               =   new Date(today);

    const { actionPoint }   =   useContext(ActionPointViewContext);

    const RoomCommentPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [isScroll, setIsScroll]        =   useState(false);

    const onComplete = (value: string) => {

        RoomsAgent.commentActionPoint({
            variables: {
                roomUuid: roomId,
                actionPointUuid: actionPoint.uuid,
                comment: value
            },
            onCompletion: () => {
                let scrollPosition=scrollRef.current.scrollHeight;
                scrollRef.current.scrollTo({behavior: "smooth",top: scrollPosition})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error?.graphQLErrors[0].code] ? ERROR_CONFIG[error?.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })   
    }

    const { data, loading, error }   =  useQuery(R_ACTION_POINT_COMMENTS, {
        variables: {
            roomUuid: roomId, 
            actionPointUuid: actionPoint.uuid 
        },
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if(data && !isScroll){
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }, [data, isScroll]);

    const getDivider = (msgdate: any) => {

        if(new Date(date).toDateString() === new Date(msgdate).toDateString()){
			return ;
		}else{
			date = msgdate

            if(new Date(today).toDateString() === new Date(msgdate).toDateString()){
                return <Divider className="cm-font-size12" style={{opacity:"60%"}}>Today</Divider>
            }else if(new Date(yesterday).toDateString() === new Date(msgdate).toDateString()){
                return <Divider className="cm-font-size12" style={{opacity:"60%"}}>Yesterday</Divider>
            }else{
                return <Divider className="cm-font-size12" style={{opacity:"60%"}}>{`${CommonUtil.__getDateDay(new Date(msgdate))}, ${new Date(msgdate).getFullYear()}`}</Divider>
            }
		}
    };

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return(
        <>
            <div ref={scrollRef} className="cm-overflow-auto" style={RoomCommentPermission ? {height: "calc(100% - 100px)"} : {height: "calc(100% - 30px)"}}>
                {
                    data._rActionPointComments.length > 0 
                    ?
                        data._rActionPointComments.map((_comment: any) => {
                            return (
                                <>
                                    {getDivider(_comment.createdAt)}
                                    <CommentItem key={_comment.uuid} comment={_comment} seller={sellers} buyer={buyers} scrollToBottom={setIsScroll} latestMessageId={latestMessageId}/>
                                </>
                            );
                        })
                    :
                        <div className='cm-height100 cm-flex-center'>
                            <img width={160} src={NO_MESSAGES} alt='No comments found'/>
                        </div>
                }
                {
                    RoomCommentPermission && room?.properties?.isCommentsEnabled &&
                        <div className="j-action-box-layout" style={{width: "calc(100% - 40px)"}}>
                            <CommentBox sellers={sellers} buyers={buyers} onComplete={onComplete} message/>
                        </div>
                }
            </div>
            {
                !(RoomCommentPermission && room?.properties?.isCommentsEnabled) &&
                    <div style={{height: "80px", width: "calc(100% - 5px)"}} className="cm-flex-center">
                        <div className="cm-flex-center cm-width100 cm-font-opacity-black-67" style={{border: "1px solid #E8E8EC", background: "#F5F5F5", borderRadius: "6px", height: "50px"}}>
                            You don't have permission to send message
                        </div>
                    </div>
            }
        </>
    )
}

export default ActionViewComment
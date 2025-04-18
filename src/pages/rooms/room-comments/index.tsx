import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Button, Divider, Space } from "antd";

import { NotificationAgent } from "../../notifications/api/notification-agent";
import { FEATURE_ROOMS } from "../../../config/role-permission-config";
import { PermissionCheckers } from "../../../config/role-permission";
import { NO_MESSAGES } from "../../../constants/module-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { ROOM_COMMENTS } from "../api/rooms-query";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";
import { useRoom } from "../room-collaboration";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import CommentBox from "../../../components/comment-box/comment-box"
import RoomCommentItem from "./room-comment-item";
import Loading from "../../../utils/loading";

const RoomComments = () => {

    const { roomId }        =   useParams();
    const { $sellers, $user }      =   useContext(GlobalContext)
    const { room }          =   useRoom();
    const scrollRef: any    =   useRef();
    const $roomBuyers       =   room.buyers;

    const RoomCommentPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [filter, setFilter]                   =   useState<any>(undefined);
    const [isScroll, setIsScroll]               =   useState(false);

    let date 									= 	"";
	let today									=	new Date();
    let yesterday                               =   new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const [_getRoomComments,{ data, loading, error }]    =   useLazyQuery(ROOM_COMMENTS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        _getRoomComments({
            variables: {
                roomUuid :  roomId,
                "filter": {
                    entityUuid: filter?.uuid
                }
            }
        })
    }, [filter])

    const markAllAsRead = () => {
        NotificationAgent.s_roomNotificationsAsRead({
            variables: {
                roomUuid :  roomId,
                filter: 'MESSAGE'
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    const markAllAsViewed = () => {
        NotificationAgent.s_roomNotificationsAsRead({
            variables: {
                roomUuid :  roomId,
                filter: 'MESSAGE'
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    useEffect(() => {
        if(data && !isScroll){
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }, [data, isScroll]);

    useEffect(() => {
        if(data){
            markAllAsRead();
            markAllAsViewed();
        }
    }, [data])
    
    const onComplete = (value: string) => {
        RoomsAgent.commentInRoom({
            variables: {
                roomUuid: roomId,
                comment: value
            }, 
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error?.graphQLErrors[0].code] ? ERROR_CONFIG[error?.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })   
    }

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

    const filteredMessages = data?._rRoomComments.filter((_comment: any) => !(_comment.comment.includes("widgetId=")))

    if(error) return <SomethingWentWrong/>

    return(
        <div className="cm-flex-center cm-height100 cm-padding15">
            <div className="j-room-comments cm-height100" style={{padding: "15px 0px 15px 15px"}}>
                <div className="cm-flex-space-between">
                    <div className="cm-font-size16 cm-font-fam-500 cm-margin-bottom10">Messages {filteredMessages?.length > 0 ? `(${filteredMessages?.length})` : ""}</div>
                    <Space size={0}>
                        {filter && 
                            <>
                                <span className="cm-font-size11 cm-light-text">Showing <span className="cm-font-size13 cm-secondary-text">{filter.name}</span> comments</span>
                                <Button type="primary" ghost onClick={() => setFilter(undefined)} className="cm-border-none cm-font-size13">Reset</Button>
                            </>
                        }
                    </Space>
                </div>
                <div ref={scrollRef} className="cm-overflow-auto cm-padding-right15" style={RoomCommentPermission ? {height: "calc(100% - 115px)"} : {height: "calc(100% - 40px)"}}>
                    {
                        loading
                        ? 
                            <Loading/> 
                        : 
                            filteredMessages?.length > 0
                            ?
                                filteredMessages?.filter((_comment: any) => !(_comment.comment.includes("widgetId="))).map((_comment: any) => {
                                    return (
                                        <>
                                            {getDivider(_comment.createdAt)}
                                            <RoomCommentItem key={_comment.uuid} comment={_comment} seller={$sellers} buyer={$roomBuyers} setFilter={setFilter} scrollToBottom={setIsScroll}/>
                                        </>
                                    )
                                })
                            :
                                <div className='cm-height100 cm-flex-center'>
                                    <img width={160} src={NO_MESSAGES} alt='No messages found'/>
                                </div>
                    }
                </div>
                {
                    RoomCommentPermission && room?.properties?.isMessageEnabled ?
                        <div className="j-room-comment-box">
                            <CommentBox sellers={$sellers} buyers={$roomBuyers} onComplete={onComplete} message={"roomMessage"}/>
                        </div>
                    :
                        <div style={{height: "90px", width: "calc(100% - 15px)"}} className="cm-flex-center">
                            <div className="cm-flex-center cm-width100 cm-font-opacity-black-67" style={{border: "1px solid #E8E8EC", background: "#F5F5F5", borderRadius: "6px", height: "50px"}}>
                                You don't have permission to send message
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default RoomComments
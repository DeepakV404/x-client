import { useQuery } from "@apollo/client";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useRef, useState } from "react";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import { ERROR_CONFIG } from "../../../../../config/error-config";
import { NO_MESSAGES } from "../../../../../constants/module-constants";
import useLocalization from "../../../../../custom-hooks/use-translation-hook";
import { CommonUtil } from "../../../../../utils/common-util";
import Loading from "../../../../../utils/loading";
import { GlobalContext } from "../../../../../globals";
import { useRoom } from "../../../room-collaboration";
import { useParams } from "react-router-dom";
import { RoomsAgent } from "../../../api/rooms-agent";
import { ROOM_COMMENTS } from "../../../api/rooms-query";
import CommentItem from "../../../room-action-plan/comment-item";


interface ActionCommentProps {
    widget: any;
}

const WidgetComment: React.FC<ActionCommentProps> = (props) => {
    
    const { widget } = props;

    const { translate } = useLocalization();

    const { roomId }    =   useParams()

    const { $sellers }  =   useContext(GlobalContext);

    const { room }      =   useRoom();
    
    const $roomBuyers   = room;

    const { data, loading }  =   useQuery(ROOM_COMMENTS, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid :  roomId,
        }
    });

    const [message, setMessage]     =   useState("")
    const [isScroll, setIsScroll]   =   useState(false);

    const scrollRef                 =   useRef<any>();

    useEffect(() => {
        if(data && !isScroll){
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }, [data, isScroll]);

    const onFinish = () => {
        RoomsAgent.commentInRoom({
            variables: {
                roomUuid: roomId,
                comment:   message + " widgetId=" + widget.uuid
            }, 
            onCompletion: () => {
                setMessage("")
                let scrollPosition=scrollRef.current.scrollHeight;
                scrollRef.current.scrollTo({behavior: "smooth",top: scrollPosition})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error?.graphQLErrors[0].code] ? ERROR_CONFIG[error?.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        }) 
    }

    const widgetIdRegex = /widgetId=([a-fA-F0-9-]+)/; 

    const filteredMessages = data?._rRoomComments?.map((message: any) => {
        const match = message.comment.match(widgetIdRegex); 
        if (!match) return null; 

        const extractedWidgetId = match[1]; 
        if (extractedWidgetId !== widget?.uuid) return null; 

        return {...message, comment: message.comment.replace(widgetIdRegex, '').trim()};
    }).filter(Boolean); 

    // function stripHtmlTags(html: string) {
    //     const doc = new DOMParser().parseFromString(html, "text/html");
    //     return `Comments ${doc.body.textContent ? `- ${doc.body.textContent}` : ""}` || "Comments";
    // }

    return (
        <div style={{minHeight: "200px", width: "400px", padding: "15px"}}>
            Comments
            {
                <div ref={scrollRef} style={{height: "215px", overflow: "auto", marginBlock: "15px"}}>
                    {   loading 
                        ?   <Loading /> 
                        :   filteredMessages.length 
                            ?
                                filteredMessages.map((_comment: any) => <CommentItem key={_comment.uuid} comment={_comment} seller={$sellers} buyer={$roomBuyers} buyerComment scrollToBottom={setIsScroll}/>)
                            :
                                <div className="cm-flex-center cm-height100"><img width={200} src={NO_MESSAGES} alt='No comments found'/></div>
                    }
                </div>
            }
            <div className="cm-flex-align-center">
                <TextArea
                    placeholder={translate("common-placeholder.add-a-message")}
                    autoSize={{
                        minRows: 2,
                        maxRows: 4,
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />   
                <div className="j-action-send-btn">
                    <Button type="primary" ghost onClick={onFinish} className="cm-border-none"><MaterialSymbolsRounded font="send" size="32" filled className="cm-cursor-pointer"/></Button>
                </div>
            </div>
        </div>
    );
}

export default WidgetComment;

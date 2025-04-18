import { FC, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { Divider, Form, Space } from "antd";

import { BUYER_ACTION_POINT, P_ACTION_POINT_COMMENTS } from "../../api/buyers-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import CommentBox from "../../../components/comment-box/comment-box";
import ActionCommentItem from "./action-comment-item";
import Translate from "../../../components/Translate";
import Loading from "../../../utils/loading";
import { useLocation } from "react-router-dom";

const { useForm }   =   Form;

interface ActionCommentProps
{
    actionId    :   string;
    actionPoint :   any
    sellers     :   any
    buyers      :   any
}

const ActionComment: FC <ActionCommentProps> = (props) => {

    const { actionId, sellers, buyers }  =   props;

    const [form]            =   useForm();
    const scrollRef: any    =   useRef();
    const { state }         =   useLocation();

    let date 									= 	"";
	let today									=	new Date();
    let yesterday                               =   new Date(today);

    const [isScroll, setIsScroll]                   =   useState(false);
    const [specificComment, setSpecificComment]     =   useState(state?.currentNotificationMetaId)

    const { data, loading, error }  =   useQuery(P_ACTION_POINT_COMMENTS, {
        variables: {
            actionPointUuid  :   actionId
        },
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if(data && !isScroll && !specificComment){
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }, [data, isScroll]);

    useEffect(() => {
        if (scrollRef.current && data._pActionPointComments && specificComment) {            
            const index = data._pActionPointComments.findIndex((comment: any) => comment.uuid === specificComment);            
            if (index != -1) {
                const commentElement = scrollRef.current?.children[index];
                if (commentElement) {
                    scrollRef.current.scrollTop = scrollRef.current.children[index].offsetTop;
                    setSpecificComment(null);
                }
            }
        }
    }, [data, specificComment, scrollRef.current]);

    const { data: rData, loading: rLoading, error: rError}  =   useQuery(BUYER_ACTION_POINT, {
        fetchPolicy:    "network-only",
        variables: {
            actionPointUuid :   actionId
        }
    });

    const onComplete = (values : any) => {   
        BuyerAgent.addCommentToActionPoint({
            variables: {
                actionPointUuid :   actionId,
                comment         :   values
            },
            onCompletion: () => {
                form.resetFields()
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.comment-added-message" />);                
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const markAllAsRead = () => {
        BuyerAgent.markAPNotiAsRead({
            variables: {
                actionPointUuid : actionId
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    useEffect(() => {
        markAllAsRead()
    }, [])

    const getDivider = (msgDate: any) => {

        if(new Date(date).toDateString() === new Date(msgDate).toDateString()){
			return ;
		}else{
			date = msgDate

            if(new Date(today).toDateString() === new Date(msgDate).toDateString()){
                return <Divider className="cm-font-size12" style={{opacity:"60%", marginBottom: 0}}>Today</Divider>
            }else if(new Date(yesterday).toDateString() === new Date(msgDate).toDateString()){
                return <Divider className="cm-font-size12" style={{opacity:"60%", marginBottom: 0}}>Yesterday</Divider>
            }else{
                return <Divider className="cm-font-size12" style={{opacity:"60%", marginBottom: 0}}>{`${CommonUtil.__getDateDay(new Date(msgDate))}, ${new Date(msgDate).getFullYear()}`}</Divider>
            }
		}
    };


    if(loading || rLoading) return <Loading />
    if(error || rError) return <SomethingWentWrong/>

    return(
        <div className="j-buyer-ap-comment-container">
            <Space size={4} className="cm-margin-bottom10"><Translate i18nKey={"common-labels.comments"}/> {rData.buyerActionPoint.totalComments > 0 && <span className="cm-dark-grey-text">({rData.buyerActionPoint.totalComments})</span> }</Space>
            <div ref={scrollRef} className="cm-overflow-auto" style={{height: "calc(100% - 110px)"}}>
            {
                data._pActionPointComments.length > 0 ? (
                    data._pActionPointComments.map((_comment:any) => {
                        return (
                            <>
                                {getDivider(_comment.createdAt)}
                                <ActionCommentItem comment={_comment} seller={sellers} buyer={buyers} buyerComment={true} scrollToBottom={setIsScroll}/>
                            </>
                        );
                    })
                ) : (
                    <div className="cm-flex-center cm-light-text cm-font-size13" style={{ height: "calc(100% - 70px)" }}>
                        <Translate i18nKey="common-empty.no-comments-found" />
                    </div>
                )
            }
            </div>
            <CommentBox sellers={sellers} buyers={buyers} onComplete={onComplete} className="j-buyer-ap-comment-box-wrapper"/>
        </div>
    )
}

export default ActionComment;
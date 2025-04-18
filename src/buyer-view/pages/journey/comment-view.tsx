import { FC, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { Divider, Form } from "antd";

import { BUYER_ACTION_POINT, P_ACTION_POINT_COMMENTS } from "../../api/buyers-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import CommentBox from "../../../components/comment-box/comment-box";
import Loading from "../../../utils/loading";
import Translate from "../../../components/Translate";
import ActionCommentItem from "./action-comment-item";

const { useForm }   =   Form;

interface PopoverContentProps
{
    actionId    :   string;
    buyers      :   any
    sellers     :   any
}

const PopoverContent: FC<PopoverContentProps> = (props) => {

    const { actionId, buyers, sellers }      =   props;

    let date 				= 	"";
    let today				=	new Date();
    let yesterday           =   new Date(today);

    const [form]            =   useForm();
    const scrollRef         =   useRef<any>();
    const [isScroll, setIsScroll]   =   useState(false);

    const { data, loading, error }  =   useQuery(P_ACTION_POINT_COMMENTS, {
        variables: {
            actionPointUuid  :   actionId
        },
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if(data && !isScroll){
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }, [data, isScroll]);

    const { data: rData, loading: rLoading, error: rError}  =   useQuery(BUYER_ACTION_POINT, {
        fetchPolicy:    "network-only",
        variables: {
            actionPointUuid :   actionId
        }
    });
     
    const onComplete = (values: any) => {

        BuyerAgent.addCommentToActionPoint({
            variables: {
                actionPointUuid :   actionId,
                comment         :   values
            },
            onCompletion: () => {
                form.resetFields()     
                let scrollPosition=scrollRef.current.scrollHeight;
                scrollRef.current.scrollTo({behavior: "smooth",top: scrollPosition})
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

    const getDivider = (msgdate: any) => {

        if(new Date(date).toDateString() === new Date(msgdate).toDateString()){
			return ;
		}else{
			date = msgdate

            if(new Date(today).toDateString() === new Date(msgdate).toDateString()){
                return <Divider className="cm-font-size12" style={{opacity:"60%", marginBottom: 0}}>Today</Divider>
            }else if(new Date(yesterday).toDateString() === new Date(msgdate).toDateString()){
                return <Divider className="cm-font-size12" style={{opacity:"60%", marginBottom: 0}}>Yesterday</Divider>
            }else{
                return <Divider className="cm-font-size12" style={{opacity:"60%", marginBottom: 0}}>{`${CommonUtil.__getDateDay(new Date(msgdate))}, ${new Date(msgdate).getFullYear()}`}</Divider>
            }
		}
    };

    if(loading || rLoading) return <Loading/>
    if(error || rError) return <SomethingWentWrong/>

    return (
        <div onClick={(event) => event.stopPropagation()} style={{width: "400px", height: "300px"}}>
            <div className="cm-font-fam500">{rData.buyerActionPoint.totalComments > 1 ? <Translate i18nKey={"common-labels.comments"}/> : <Translate i18nKey={"common-labels.comment"}/>} {rData.buyerActionPoint.totalComments > 0 && <span className="cm-font-size12 cm-dark-grey-text">({rData.buyerActionPoint.totalComments})</span>}</div>
            <div ref={scrollRef} className="cm-scrollbar-none" style={{height: "calc(100% - 90px)", overflow: "scroll", overflowX: "hidden"}}>
                {
                    data._pActionPointComments.length > 0 ?
                        data._pActionPointComments.map((_comment: any) => (
                            <>
                                {getDivider(_comment.createdAt)}
                                <ActionCommentItem key={_comment.uuid} comment={_comment} seller={sellers} buyer={buyers} buyerComment scrollToBottom={setIsScroll}/>
                            </>
                        ))
                    :
                        <div className="cm-flex-center cm-light-text cm-height100" style={{height: "200px"}}><Translate i18nKey={"common-empty.no-comments-found"}/></div>
                }
            </div>
            <div className="j-buyer-comment-popup-input">
                <CommentBox sellers={sellers} buyers={buyers} onComplete={onComplete} />
            </div>
        </div>
    );
};

export default PopoverContent;
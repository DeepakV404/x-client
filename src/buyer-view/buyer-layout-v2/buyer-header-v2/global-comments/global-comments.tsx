import { useContext, useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Divider, Space, Typography } from "antd";

import { BuyerAgent } from "../../../api/buyer-agent";
import { CommonUtil } from "../../../../utils/common-util";
import { BuyerGlobalContext } from "../../../../buyer-globals";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { P_ROOM_COMMENTS } from "../../../api/buyers-query";

import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import CommentBox from "../../../../components/comment-box/comment-box";
import Translate from "../../../../components/Translate";
import Loading from "../../../../utils/loading";
import CommentCard from "./comment-card";

const { Text }        =   Typography

const GlobalComments = (props: {handleMessagesClose: any}) => {

    const { handleMessagesClose }   =   props;

    const { $sellers, $buyerData }          =   useContext<any>(BuyerGlobalContext);

    const scrollRef: any                    =   useRef();

    const [filter, setFilter]               =   useState<any>(undefined);
    const [isScroll, setIsScroll]           =   useState(false);

    let date 									= 	"";
	let today									=	new Date();
    let yesterday                               =   new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const [_getComments, { data, loading, error }]  =   useLazyQuery(P_ROOM_COMMENTS, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        _getComments({
            variables: {
                filter: {
                    entityUuid : filter?.uuid
                }
            }
        })
    }, [filter])

    useEffect(() => {
        if(data && !isScroll){
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }, [data, isScroll]);

    const onComplete = (values: any) => {
        BuyerAgent.commentInRoom({
            variables: {
                comment:   values
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error) 
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

    if(error) return <SomethingWentWrong/>

    return (
        <div className="cm-padding15">
            <div className="cm-flex-direction-column cm-margin-bottom10">
                <Space className="cm-flex-align-center" style={{justifyContent: "space-between"}}>
                    <Space>
                        <div className="j-buyer-comments-collpase-icon" onClick={() => handleMessagesClose()}>
                            <MaterialSymbolsRounded font="keyboard_double_arrow_right" color="#000000D9" size="20" filled/>
                        </div>
                        <Text className="cm-font-fam500">
                            <Translate i18nKey={"common-labels.messages"}/> {data?._pRoomComments.length > 0 ? `(${data?._pRoomComments.length})` : null}
                        </Text>
                    </Space>
                </Space>
                {
                    filter &&
                        <div className="cm-flex-justify-end" style={{paddingRight: "10px"}}>
                            <Text className="cm-font-size11" style={{color: "#0E0B3D"}}>
                            showing&nbsp;
                            <Text style={{maxWidth: "120px"}} ellipsis={{tooltip: filter.name}} className="cm-font-fam500 cm-font-size11 cm-actionpoint-name-hover-bold"> 
                                {filter.name}
                            </Text>&nbsp;comments &nbsp; <span className="j-hyperlink-text cm-cursor-pointer" onClick={() => setFilter(undefined)}>Reset</span></Text>
                        </div>
                }
            </div>
            {loading 
                ? 
                    <div style={{height: "calc(100vh - 150px"}}><Loading/></div> 
                :
                <div ref={scrollRef} className="cm-margin-block20 cm-overflow-auto" style={{height: "calc(100vh - 150px"}}>
                    {data?._pRoomComments.length > 0 ? (
                            data?._pRoomComments.map((_comment: any) => {
                                return (
                                    <>
                                        {getDivider(_comment.createdAt)}
                                        <CommentCard comments={_comment} seller={$sellers} buyer={$buyerData?.buyers} setFilter={setFilter} scrollToBottom={setIsScroll}/>
                                    </>
                                );
                            })
                        ) : (
                            <div className="cm-flex-center cm-light-text" style={{height: "calc(100vh - 150px"}}><Translate i18nKey={"common-empty.no-messages-found"}/></div>
                        )}
                </div>
            }
            <div className="j-buyer-comment-box-wrapper">
                <CommentBox sellers={$sellers} buyers={$buyerData?.buyers} onComplete={onComplete} message={false}/>
            </div>
        </div>
    )
}

export default GlobalComments
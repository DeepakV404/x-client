import { Divider } from 'antd';

import { useContext, useEffect, useRef, useState } from 'react';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { useQuery } from '@apollo/client';
import { P_ROOM_COMMENTS } from '../../api/buyers-query';
import { BuyerAgent } from '../../api/buyer-agent';
import { CommonUtil } from '../../../utils/common-util';
import { ERROR_CONFIG } from '../../../config/error-config';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import Translate from '../../../components/Translate';
import Loading from '../../../utils/loading';
import MessageCard from './message-card';
import BuyerMessageBox from '../../components/buyer-message-box';

const ChatWindow = (props: {isMobile: boolean, handleMessagesClose: any}) => {

    const { isMobile, handleMessagesClose }      =   props;

    const scrollRef: any                    =   useRef();

    const [isScroll, setIsScroll]           =   useState(false);

    const { $sellers, $buyerData }          =   useContext<any>(BuyerGlobalContext);

    let date 									= 	"";
	let today									=	new Date();
    let yesterday                               =   new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const { data, loading, error }  =   useQuery(P_ROOM_COMMENTS, {
        fetchPolicy: "network-only",
    });

    const scrollToBottom = () => {
        if (scrollRef.current) {
            requestAnimationFrame(() => {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            });
        }
    };

    useEffect(() => {
        if(data){
            if(scrollRef.current){
                scrollToBottom()
            }
        }
    }, [data, isScroll]);

    const onComplete = (values: any) => {
        BuyerAgent.commentInRoom({
            variables: {
                comment:   values
            },
            onCompletion: () => {
                scrollToBottom()
            },
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
        <div className="j-buyer-chat-layout">
            {
                isMobile ?
                    <div className='j-buyer-messages-header cm-flex-space-between cm-flex-align-center cm-padding-inline20 cm-font-fam500'>
                        <div className='cm-font-size16'><Translate i18nKey={"common-labels.messages"}/></div>
                        <MaterialSymbolsRounded font='close' size='24' className='cm-cursor-pointer' onClick={handleMessagesClose}/>
                    </div>
                :
                    <div className='j-buyer-messages-header cm-flex-center cm-font-fam500'>
                        <Translate i18nKey={"common-labels.messages"}/>
                    </div>

            }
            <div ref={scrollRef} className='cm-padding15 cm-overflow-auto' style={isMobile ? {height: "calc(100% - 155px)"} : {height: "calc(100% - 145px)"}}>
                {loading 
                    ? 
                        <div style={{height: "500px"}}><Loading/></div> 
                    :
                        <>
                            {data?._pRoomComments.length > 0 ? 
                                (
                                    data?._pRoomComments.filter((_filteredComment: any) => !(_filteredComment.comment.includes("widgetId="))).map((_comment: any) => {
                                        return (
                                            <>
                                                {getDivider(_comment.createdAt)}    
                                                <MessageCard comments={_comment} seller={$sellers} buyer={$buyerData?.buyers} scrollToBottom={setIsScroll}/>
                                            </>
                                        );
                                    })
                                ) : (
                                    <div className='cm-flex-center cm-height100 cm-font-opacity-black-65'><Translate i18nKey={"common-empty.no-messages-found"}/></div>
                                )
                            }
                        </>
                }
            </div>
            <div className="j-buyer-message-box-wrapper cm-padding15 cm-width100">
                <BuyerMessageBox sellers={$sellers} buyers={$buyerData?.buyers} onComplete={onComplete}/>
            </div>
        </div>
    )
}

export default ChatWindow
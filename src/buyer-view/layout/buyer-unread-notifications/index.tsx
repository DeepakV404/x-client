import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Space, Typography } from 'antd';

import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Translate from '../../../components/Translate';

const { Text }  =   Typography;

const UnreadNotificationBody = (props: {notifications: any, onClose: () => void, handleMessageOpen: any}) => {

    const { notifications, onClose, handleMessageOpen } =   props;

    const navigate = useNavigate();

    const [filter, setFilter]   =   useState("all")

    let allUnreadItems = notifications._pUnreadMessages.concat(notifications._pUnreadComments).filter((_comment: any) => !(_comment.comment.includes("widgetId=")))
    
    const getComment = (notification: any) => {

        const parseUsers = (notification: any) => {
            return notification.comment.replace(/\{@([bs])#([a-zA-Z0-9-]+)\}/g, function(parsedId: string, __: any) {
                const userName = CommonUtil.__getFullName(notification.metadata.mentions[parsedId].firstName, notification.metadata.mentions[parsedId].lastName)                
                return `<span class="cm-link-text">${userName}</span>`;
            });
        }

        const parseSection = (parseComment: any) => {
            return parseComment.replace(/\{@sec#([a-zA-Z0-9-]+)\}/g, (parsedSectionId: string) => {
                return `<a class="j-unread-section-comment" href="#section/${notification.metadata.mentions[parsedSectionId]?.uuid}">#${notification.metadata.mentions[parsedSectionId]?.name}</a>`;
            });
        };
        
        const parseEveryOneMention = (comment: any) => {
            return comment.replaceAll("@Everyone", () => {               
                return `<span class="cm-link-text">Everyone</span>`
            });
        }

        return CommonUtil.__replaceURLInText(parseEveryOneMention(parseSection(parseUsers(notification))))        
    }

    const handleClick = (notification: any) => {
        onClose()
        if(notification.__typename === "RoomCommentOutput"){
            navigate(`/${notification.metadata.actionPoint.stage.uuid}?actionPointId=${notification.metadata.actionPoint.uuid}`)
        }else{
            handleMessageOpen()
        }
    }

    const getFilteredArr = () => {

        let unreadMessages = [...notifications._pUnreadMessages.filter((_comment: any) => !(_comment.comment.includes("widgetId=")))];
        let unreadComments = [...notifications._pUnreadComments.filter((_comment: any) => !(_comment.comment.includes("widgetId=")))];

        if(filter === "all") return allUnreadItems.sort(function(x: any, y: any){
            return y.createdAt - x.createdAt;
        })
        else if(filter === "messages") return unreadMessages.sort(function(x: any, y: any){
            return y.createdAt - x.createdAt;
        })
        else if(filter === "comments") return unreadComments.sort(function(x: any, y: any){
            return y.createdAt - x.createdAt;
        })
    }

    const getDurationText = (timestamp: any, isPast: any) => {
        let duration = getDuration(timestamp);
    
        return duration.value + " " + duration.unit + " " + ((duration.unit && isPast) ? "ago" : "");
    }
    
    const getDuration = (timestamp: any, currentTimeStamp = new Date()) => {
    
        let duration: any = {
            unit : "",
            value : ""
        }
    
        let currentDate: any     =   currentTimeStamp;
        let inputDate: any       =   new Date(timestamp);
    
        var diffMs      =   currentDate > inputDate ? (currentDate - inputDate) : (inputDate - currentDate) ; 
        
        var diffYears   =   Math.floor(diffMs / 31557600000); 
        var diffMonths  =   Math.floor(diffMs / 2629800000); 
        var diffWeeks   =   Math.floor(diffMs / 604800000); 
        var diffDays    =   Math.floor(diffMs / 86400000); 
        var diffHrs     =   Math.floor((diffMs % 86400000) / 3600000); 
        var diffMins    =   Math.round(((diffMs % 86400000) % 3600000) / 60000); 

        if(diffYears > 0) {
            duration.unit = diffYears === 1 ? "year" : "years";
            duration.value = diffYears;
        }
    
        else if(diffMonths > 0) {
            duration.unit = diffMonths === 1 ? "month" : "months";
            duration.value = diffMonths;
        }
    
        else if(diffWeeks > 0) {
            duration.unit = diffWeeks === 1 ? "week" : "weeks";
            duration.value = diffWeeks;
        }
    
        else if(diffDays > 0) {
            duration.unit = diffDays === 1 ? "day" : "days";
            duration.value = diffDays;
        }
    
        else if(diffHrs > 0) {
            duration.unit = diffHrs === 1 ? "hour" : "hours";
            duration.value = diffHrs;
        }
    
        else if(diffMins > 0) {
            duration.unit = diffMins === 1 ? "min" : "mins";
            duration.value = diffMins;
        }
    
        else {
            duration.value = "recently"
        }
    
        return duration;
        
    }

    return (
        <div>
            <div className='cm-margin-bottom20'>
                <div className='cm-flex-space-between cm-flex-align-center cm-margin-bottom20'>
                    <Space direction='vertical'>
                        <div className="cm-white-text cm-font-fam500 cm-font-size16"><Translate i18nKey='unread-noti.you-have'/> {allUnreadItems.length} <Translate i18nKey='unread-noti.you-have-statement'/></div>
                        <div className="cm-white-text cm-font-size12"><Translate i18nKey='unread-noti.unread-subtitle'/></div>
                    </Space>
                    <div className="j-unread-notif-close-btn cm-font-size12 cm-flex-center" onClick={() => onClose()}>
                        <MaterialSymbolsRounded font='close' size='20' weight='400'/>
                    </div>
                </div>
                <Space>
                    <div className={`j-unread-noti-filter-pill cm-font-size12 ${filter === "all" ? "selected" : ""}`} onClick={() => setFilter("all")}>
                        <Translate i18nKey='common-labels.all'/> ({allUnreadItems.length})
                    </div>
                    {
                        notifications._pUnreadMessages.length > 0 &&
                            <div className={`j-unread-noti-filter-pill cm-font-size12 ${filter === "messages" ? "selected" : ""}`} onClick={() => setFilter("messages")}>
                                <Translate i18nKey='common-labels.messages'/> ({notifications._pUnreadMessages.filter((_comment: any) => !(_comment.comment.includes("widgetId="))).length})
                            </div>
                    }
                    {
                        notifications._pUnreadComments.length > 0 &&
                            <div className={`j-unread-noti-filter-pill cm-font-size12 ${filter === "comments" ? "selected" : ""}`} onClick={() => setFilter("comments")}>
                                <Translate i18nKey='common-labels.comments'/> ({notifications._pUnreadComments.length})
                            </div>
                    }
                </Space>
            </div>
            <div className="j-unread-noti-root">
                {
                    getFilteredArr().map((_notification: any) => (
                        <div className="j-unread-message-card" onClick={() => handleClick(_notification)}>
                            <div className="cm-flex-space-between">
                                <Space className="cm-flex-align-center">
                                    <Avatar className="cm-flex-center" size={25} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", lineHeight: "25px"}} src={_notification.createdStakeholder.profileUrl ? <img src={_notification.createdStakeholder.profileUrl} alt={CommonUtil.__getFullName(_notification.createdStakeholder.firstName, _notification.createdStakeholder.lastName)}/> : ""}>
                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_notification.createdStakeholder.firstName, _notification.createdStakeholder.lastName), 1)}
                                    </Avatar>
                                    <Text style={{maxWidth: "200px"}} ellipsis={{tooltip: "Deepak V"}} className="cm-font-fam500 cm-font-size13">{CommonUtil.__getFullName(_notification.createdStakeholder.firstName, _notification.createdStakeholder.lastName)}</Text>
                                </Space>
                                <div className="cm-dark-grey-text cm-flex-align-center cm-font-size12">
                                    {
                                        getDurationText(_notification.createdAt, true)
                                    }
                                </div>
                            </div>
                            <div className="j-unread-message-wrapper">
                                <div className="cm-font-size14 cm-font-fam400 cm-line-height23 cm-margin-bottom10 cm-margin-top5px" style={{letterSpacing: "0.2px", color: "#0E0B3D", wordBreak: "break-word", width: "calc(100% - 25px)"}} dangerouslySetInnerHTML={{__html: getComment(_notification).replace(/(?:\r\n|\r|\n)/g, '<br>')}}></div>
                                {
                                    _notification.__typename === "CommentOutput" ? 
                                        <div className='j-unread-noti-type-icon-wrap cm-flex-center' style={{background: "#0065E526"}}>
                                            <MaterialSymbolsRounded font="comment" size="16" color='#0065E5' weight='400'/>
                                        </div>
                                    :
                                        <div className='j-unread-noti-type-icon-wrap cm-flex-center' style={{background: "#D85B0026"}}>
                                            <MaterialSymbolsRounded font="sms" size="16" color='#D85B00' weight='400'/>
                                        </div>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default UnreadNotificationBody
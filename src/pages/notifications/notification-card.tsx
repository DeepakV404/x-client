import { createSearchParams, useNavigate } from 'react-router-dom';
import { Avatar, Card, Col, Image, Row, Space, Typography } from 'antd';

import { NOTIFICATION_CONFIG, TYPE_ACTION_POINT, TYPE_COMMENT, TYPE_INVTE, TYPE_MENTIONS, TYPE_RESOURCE, TYPE_SECTION, TYPE_ROOM_ENTRY, TYPE_STEP, TYPE_MENTION_COMMENT } from './config/notification-config';
import { THUMBNAIL_FALLBACK_ICON } from '../../constants/module-constants';
import { NotificationAgent } from './api/notification-agent';
import { ERROR_CONFIG } from '../../config/error-config';
import { CommonUtil } from '../../utils/common-util';

import Translate from '../../components/Translate';

const { Text, Paragraph }  =   Typography;

const NotificationCard = (props: {notification: any, onResourceNotificationClick: (resource: any) => void, onClose: any}) => {

    const { notification, onResourceNotificationClick, onClose }      =   props;

    const { metaKey }           =   NOTIFICATION_CONFIG[notification.type];

    const navigate  =   useNavigate()
    
    const getNotificationMeta = () => {
        switch(metaKey){
            case TYPE_RESOURCE:
                let _resource = notification.metadata.hasData ? notification.metadata.resources : null
                if(_resource){
                    return (
                        _resource.map((res: any) => {
                            return(
                                <Space className='cm-flex' onClick={() => onResourceNotificationClick(res)}>
                                    <Image style={{objectFit: "scale-down"}} className='cm-border-radius8' preview={false} width={45} height={45} src={res.content.thumbnailUrl ? res.content.thumbnailUrl : THUMBNAIL_FALLBACK_ICON} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= THUMBNAIL_FALLBACK_ICON}}/> 
                                    <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: res.title}} className='cm-font-size13 cm-font-fam500'>{res.title}</Text>
                                </Space>
                            )
                        })
                    )
                }else return null
            
            case TYPE_ACTION_POINT:
                let _actionPoint = notification.metadata.hasData ? notification.metadata.actionPoint : null
                if(_actionPoint){
                    return (
                        <Space direction='vertical'>
                            <Space direction='vertical' size={0}>
                                <Paragraph className='cm-margin0 cm-light-text cm-font-size12'><Translate i18nKey='step.action-point'/>:</Paragraph>
                                <Paragraph style={{maxWidth: "350px"}} ellipsis={{tooltip: _actionPoint.name}} className='cm-margin0 cm-font-size13 cm-font-fam500'>{_actionPoint.name}</Paragraph>
                            </Space>
                            {
                                notification?.metadata?.CommentText ?
                                    <Space direction='vertical' size={0}>
                                        <Paragraph className='cm-margin0 cm-light-text cm-font-size12' ellipsis={{rows: 2}}><Translate i18nKey='common-labels.comment'/>:</Paragraph>
                                        <Paragraph ellipsis={{rows: 2}} className='cm-font-size13 cm-margin0'>{notification?.metadata?.CommentText}</Paragraph>
                                    </Space>
                                :
                                    null
                            }
                        </Space>

                    )
                }else return null

            case TYPE_MENTION_COMMENT:
                if(notification?.metadata?.CommentText){
                    return (
                        <Space direction='vertical'>
                            <Space direction='vertical' size={0}>
                                <Paragraph className='cm-margin0 cm-light-text cm-font-size12' ellipsis={{rows: 2}}><Translate i18nKey='common-labels.comment'/>:</Paragraph>
                                <Paragraph ellipsis={{rows: 2}} className='cm-font-size13 cm-margin0'>{notification?.metadata?.CommentText}</Paragraph>
                            </Space>
                        </Space>
    
                    )
                }else return null
            
            // case TYPE_COMMENT:
            //     return (
            //         <Paragraph className='cm-font-size13 cm-secondary-text' ellipsis={{rows: 2, expandable: true, symbol: "Read more", onExpand: (event) => event.stopPropagation()}} style={{letterSpacing: "0.3px"}}> <div dangerouslySetInnerHTML={{__html: getComment().replace(/(?:\r\n|\r|\n)/g, '<br>')}}/> </Paragraph>
            //     )
            
            case TYPE_SECTION:
                let _section = notification.metadata.hasData ? notification.metadata.section : null;
                if(_section){
                    return (
                        <Row gutter={[10, 0]}>
                            <Col span={5} className='cm-light-text cm-font-size12'>
                                <Translate i18nKey='common-labels.section'/>:
                            </Col>
                            <Col span={19}>
                                <Paragraph style={{maxWidth: "350px"}} ellipsis={{tooltip: _section.name}} className='cm-font-size13 cm-font-fam500'>{_section.name}</Paragraph>
                            </Col>
                        </Row>
                    )
                }else return null
            
            case TYPE_STEP:
                let _step = notification.metadata.hasData ? notification.metadata.stage : null;
                if(_step){
                    return (
                        <Row gutter={[10, 0]}>
                            <Col span={5} className='cm-light-text cm-font-size12'>
                                <Translate i18nKey='step.step'/>:
                            </Col>
                            <Col span={19}>
                                <Paragraph style={{maxWidth: "350px"}} ellipsis={{tooltip: _step.name}} className='cm-font-size13 cm-font-fam500'>{_step.name}</Paragraph>
                            </Col>
                        </Row>
                    )
                }else return null
            
            case TYPE_ROOM_ENTRY:
                return null
            
            default:
                return null
        }
    }

    const onActionPointClick = (stageId: string, actionId: string) => {
        navigate(
            {
                pathname: stageId,
                search: `?${createSearchParams({
                    actionPointId: actionId,
                })}`
            },
            {
                state: notification.metadata.comment ? {"currentNotificationMetaId" : notification.metadata.comment.uuid} : null
            }
        )
    }

    const handleNotificationClick = (_notification: any) => {
        
        NotificationAgent.markAsRead({
            variables: {
                notificationUuid : notification.uuid
            },
            onCompletion: () => {
                switch (metaKey) {
                    case TYPE_ACTION_POINT: 
                        _notification.metadata.hasData ? 
                            onActionPointClick(_notification.metadata.stage.uuid, _notification.metadata.actionPoint.uuid)
                        :
                            null
                        return null
                    case TYPE_COMMENT:
                    case TYPE_MENTIONS: 
                        return
                    case TYPE_MENTION_COMMENT: 
                        onActionPointClick(_notification.metadata.stage.uuid, _notification.metadata.actionPoint.uuid)
                        return 
                    case TYPE_SECTION:
                        navigate(`/section/${_notification.metadata.section.uuid}`)
                        return 
                    case TYPE_STEP:
                        navigate(`/${_notification.metadata.stage.uuid}`)
                        onClose()
                        return
                }
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    const DueDateText = () => {
        if(notification.metadata.oldDue === null) {
            return <span>to <strong>{CommonUtil.__getDateDay(new Date(notification.metadata.updatedDue))}</strong></span>;        
        }else {
            return <span>from <strong>{CommonUtil.__getDateDay(new Date(notification.metadata.oldDue))}</strong> <span> to </span> <strong>{CommonUtil.__getDateDay(new Date(notification.metadata.updatedDue))}</strong></span>;        
        }
    }

    const otherText = (metaKey: string) => {
        if(metaKey === TYPE_INVTE){
            return <span className='cm-font-fam500'>{notification.metadata.emailId}</span>
        }else if(metaKey === TYPE_ROOM_ENTRY && notification.metadata.contactSource === "NON_GATED"){
            return <span className='cm-font-fam500'><Translate i18nKey='buyers-notifications.via-gated-flow'/></span>
        }else{
            return null
        }
    }

    return (
        <Card key={notification.uuid} className='j-notification-card cm-width100 cm-cursor-pointer cm-position-relative' onClick={() => handleNotificationClick(notification)}>
            <div className='cm-flex cm-width100' style={{columnGap: "10px"}}>
                <div>
                    {
                        notification.createdBy ?
                            <Avatar shape='square' size={35} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", display: "flex" }}
                                src={notification?.createdBy?.profileUrl ? <img src={notification?.createdBy?.profileUrl} alt={CommonUtil.__getFullName(notification?.createdBy?.firstName, notification?.createdBy?.lastName)}/> : ""}
                            >
                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName(notification.createdBy?.firstName, notification.createdBy?.lastName),1)}
                            </Avatar>
                        :
                            <Avatar shape='square' size={35} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", display: "flex" }}
                                src={notification?.createdBy?.profileUrl ? <img src={notification?.createdBy?.profileUrl} alt={CommonUtil.__getFullName("Unknown", "")}/> : ""}
                            >
                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName("Unknown", ""),1)}
                            </Avatar>
                    }
                </div>
                <Space direction='vertical' className='cm-width100' size={15}>
                    <Space direction='vertical' size={0} className='cm-width100'>
                        <span>
                            <span className='cm-font-fam500'>{CommonUtil.__getFullName(notification?.createdBy?.firstName, notification?.createdBy?.lastName)} </span> 
                            <span className='cm-font-size13'><Translate i18nKey={NOTIFICATION_CONFIG[notification.type].i18nKey}/> {otherText(metaKey)} {notification.metadata.updatedDue ? DueDateText() : "" }</span>
                        </span>
                        <div className="cm-font-size10 cm-light-text">{`${CommonUtil.__getDateDay(new Date(notification.createdAt))}, ${new Date(notification.createdAt).getFullYear()}`} - {CommonUtil.__format_AM_PM(notification.createdAt)}</div>
                    </Space>
                    {getNotificationMeta()}
                </Space>
            </div>
        </Card>
    )
}

export default NotificationCard
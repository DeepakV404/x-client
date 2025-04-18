import { useNavigate } from 'react-router-dom';
import { Avatar, Card, Col, Image, Row, Space, Tag, Typography } from 'antd';

import { NOTIFICATION_CONFIG, TYPE_ACTION_POINT, TYPE_COMMENT, TYPE_INVTE, TYPE_MENTIONS, TYPE_RESOURCE, TYPE_SECTION, TYPE_ROOM_ENTRY, TYPE_STEP, TYPE_MENTION_COMMENT, TYPE_MULTIPLE_INVITE } from '../../pages/notifications/config/notification-config';
import { STAGE_STATUS_CONFIG } from '../../buyer-view/pages/journey/config/stage-status-config';
import { RESOURCE_TYPE_CONFIG } from '../../pages/library/config/resource-type-config';
import { NotificationAgent } from '../../pages/notifications/api/notification-agent';
import { ERROR_CONFIG } from '../../config/error-config';
import { CommonUtil } from '../../utils/common-util';

import MaterialSymbolsRounded from '../MaterialSymbolsRounded';
import Translate from '../Translate';

const { Text }  =   Typography;

const NotificationCard = (props: {notification: any, onResourceNotificationClick: (resource: any) => void}) => {

    const navigate = useNavigate()

    const { notification, onResourceNotificationClick }      =   props;

    const { metaKey }           =   NOTIFICATION_CONFIG[notification.type];

    const getNotificationMeta = () => {
        switch(metaKey){
            case TYPE_RESOURCE:
                let _resource = notification.metadata.hasData ? notification.metadata.resources : null
                if(_resource){                    
                    return (
                        notification.metadata.resources.map((res: any) => { 
                            return(
                                <Space className='cm-flex' onClick={() => onResourceNotificationClick(res)}>
                                    <Image style={{objectFit: "scale-down"}} className='cm-border-radius8' preview={false} width={45} height={45} src={res.content.thumbnailUrl ? res.content.thumbnailUrl : RESOURCE_TYPE_CONFIG[_resource.type]?.resourceTypeImg || ""} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= RESOURCE_TYPE_CONFIG[_resource.type]?.resourceTypeImg || ""}}/> 
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
                        <Row >
                            <Col span={4}>
                                <span className='cm-light-text cm-font-size12'>Action Point: </span>
                            </Col>
                            <Col span={20}>
                                <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: _actionPoint.name}} className='cm-font-size13 cm-font-fam500'>{_actionPoint.name}</Text>
                            </Col>
                        </Row>
                    )
                }else return null
            
            case TYPE_COMMENT:
                return null
            
            case TYPE_MENTIONS:
                return null
            
            case TYPE_INVTE:
                return null

            case TYPE_MULTIPLE_INVITE:
                if(notification?.metadata?.hasData){
                    return (
                        <>
                            <span className='cm-light-text cm-font-size12'>Emails: </span>
                            <Space direction='vertical' size={0}>
                                {
                                    notification.metadata.emailIds.map((_emailId: any) => (
                                        <div className='cm-font-size12 cm-font-fam500'>{_emailId}</div>
                                    ))
                                }
                            </Space>
                        </>
                    )
                }else{
                    return null
                }
            
            case TYPE_SECTION:
                let _section = notification.metadata.hasData ? notification.metadata.section : null
                if(_section){
                    return (
                        <Row >
                            <Col span={4}>
                                <span className='cm-light-text cm-font-size12'>Section: </span>
                            </Col>
                            <Col span={20}>
                                <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: _section.name}} className='cm-font-size13 cm-font-fam500'>{_section.name}</Text>
                            </Col>
                        </Row>
                    )
                }else return null

            case TYPE_SECTION:
                let _step = notification.metadata.hasData ? notification.metadata.stage : null
                if(_step){
                    return (
                        <Row >
                            <Col span={4}>
                                <span className='cm-light-text cm-font-size12'>Step: </span>
                            </Col>
                            <Col span={20}>
                                <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: _step.name}} className='cm-font-size13 cm-font-fam500'>{_step.name}</Text>
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

    function createSearchParamsURL(notification: any) {
        return `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/collaboration/${notification.metadata.stage.uuid}?actionPointId=${notification.metadata.actionPoint.uuid}`;
    }

    const handleNotificationClick = (_notification: any) => {
        
        NotificationAgent.s_markAsRead({
            variables: {
                notificationUuid : notification.uuid
            },
            onCompletion: () => {

                switch (metaKey) {
                    case TYPE_ACTION_POINT: 
                        const searchParam = createSearchParamsURL(notification);
                        navigate(searchParam);
                        return 
                    
                    case TYPE_COMMENT:
                        let navURL = (notification.metadata.room && notification.metadata.account) ? `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/messages` : null
                        navURL ? navigate(navURL) : null
                        return 
                    
                    case TYPE_MENTIONS:
                        let commentUrl = (notification.metadata.room && notification.metadata.account) ? `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/messages` : null
                        commentUrl ? navigate(commentUrl) : null
                        return 
                    
                    case TYPE_MENTION_COMMENT:
                        let actionPointUrl = (notification.metadata.room && notification.metadata.account) ? `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/collaboration/${notification.metadata.stage.uuid}?actionPointId=${notification.metadata.actionPoint.uuid}` : null
                        actionPointUrl ? navigate(actionPointUrl) : null
                        return 
                    
                    case TYPE_INVTE:
                        let buyingCommitteeUrl = (notification.metadata.room && notification.metadata.account) ? `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/buying_committee` : null
                        buyingCommitteeUrl ? navigate(buyingCommitteeUrl) : null
                        return 
                    
                    case TYPE_SECTION:
                        let sectionUrl = (notification.metadata.room && notification.metadata.account) ? `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/settings` : null
                        sectionUrl ? navigate(sectionUrl) : null
                        return 

                    case TYPE_STEP:
                        let stepUrl = (notification.metadata.room && notification.metadata.account) ? `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/collaboration/${notification.metadata.stage.uuid}` : null
                        stepUrl ? navigate(stepUrl) : null
                        return 
                    
                    case TYPE_MULTIPLE_INVITE:
                        let bcUrl = (notification.metadata.room && notification.metadata.account) ? `/rooms/${notification.metadata.account.uuid}/${notification.metadata.room.uuid}/buying_committee` : null
                        bcUrl ? navigate(bcUrl) : null
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

    const statusUpdate = () => {
        if(notification?.metadata.actionPoint && notification?.metadata.actionPoint?.status !== "TO_DO"){
            return(
                <Space>
                    <Tag bordered={false} style={{color: STAGE_STATUS_CONFIG[notification?.metadata.oldStatus]?.tag, backgroundColor: STAGE_STATUS_CONFIG[notification?.metadata.actionPoint?.oldStatus]?.backgroundColor}}>
                        {STAGE_STATUS_CONFIG[notification.metadata.oldStatus]?.displayName}
                    </Tag>
                    <MaterialSymbolsRounded font="trending_flat" size='20'/>
                    <Tag bordered={false} style={{color: STAGE_STATUS_CONFIG[notification?.metadata.updatedStatus]?.tag, backgroundColor: STAGE_STATUS_CONFIG[notification?.metadata.actionPoint?.updatedStatus]?.backgroundColor}}>
                        {STAGE_STATUS_CONFIG[notification.metadata.updatedStatus]?.displayName}
                    </Tag>
                </Space>
            )
        }
        return null;
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
                <div> {/* added this div to apply flex property to the avatar */}
                    {
                        notification.createdBy ?   
                            <Avatar shape='square' size={35} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", display: "flex" }}
                                src={notification?.createdBy?.profileUrl ? <img src={notification?.createdBy?.profileUrl} alt={CommonUtil.__getFullName(notification?.createdBy?.firstName, notification?.createdBy?.lastName)}/> : ""}
                            >
                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName(notification.createdBy?.firstName, notification?.createdBy?.lastName),1)}
                            </Avatar>
                        :
                            <Avatar shape='square' size={35} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", display: "flex" }}
                                src={notification?.createdBy?.profileUrl ? <img src={notification?.createdBy?.profileUrl} alt={CommonUtil.__getFullName("Unknown", "")}/> : ""}
                            >
                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName("Unknown", ""),1)}
                            </Avatar>
                    }
                </div>
                <Space direction='vertical' className='cm-width100' size={8}>
                    <Space direction='vertical' size={0} className='cm-width100'>
                        <span>
                            <span className='cm-font-fam500'>{notification?.createdBy?.firstName} </span> 
                            <span className='cm-font-size13'>{NOTIFICATION_CONFIG[notification.type].compoundText} {otherText(metaKey)} {notification.metadata.updatedDue ? DueDateText() : "" } {notification.type === "ACTION_POINT_STATUS_UPDATED" ? statusUpdate() : ""}</span>
                        </span>
                        <div className="cm-font-size10 cm-light-text" style={{marginTop: "2px"}}>{`${CommonUtil.__getDateDay(new Date(notification.createdAt))}, ${new Date(notification.createdAt).getFullYear()}`} - {CommonUtil.__format_AM_PM(notification.createdAt)}</div>
                    </Space>
                    <Row>
                        <Col span={4}>
                            <span className='cm-light-text cm-font-size12'>Room: </span>
                        </Col>
                        <Col span={20}>
                            <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: notification.metadata.room.name}} className='cm-font-size13 cm-font-fam500'>{notification.metadata.room.name} </Text>
                        </Col>
                    </Row>
                    {getNotificationMeta()}
                </Space>
            </div>
        </Card>
    )
}

export default NotificationCard
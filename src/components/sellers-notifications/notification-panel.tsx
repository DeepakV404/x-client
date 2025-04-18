import { useQuery } from "@apollo/client";
import { List, Space, Tooltip } from "antd";

import { NotificationAgent } from "../../pages/notifications/api/notification-agent";
import { NOTIFICATIONS } from "../../pages/notifications/api/notification-query";
import { useBuyerResourceViewer } from "../../custom-hooks/resource-viewer-hook";
import { ERROR_CONFIG } from "../../config/error-config";
import { CommonUtil } from "../../utils/common-util";

import SellerResourceViewerModal from "../../pages/resource-viewer/seller-resource-viewer-modal";
import SomethingWentWrong from "../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import NotificationCard from "./notification-card";
import Loading from "../../utils/loading";

const NotificationsPanel = (props: {unreadCount: number, onClose:() => void}) => {

    const { unreadCount, onClose }   =   props;

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const { data, loading, error }  =   useQuery(NOTIFICATIONS, {
        variables: {
            filter  :  'ALL'
        },
        fetchPolicy: "network-only"
    });
 
    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>
    
    const markAllAsRead = () => {
        NotificationAgent.s_markAllAsRead({
            variables: {
                filter: 'ALL'
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("All notifications marked as read")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    const clearAllNotifications = () => {
        NotificationAgent.s_clearAllNotifications({
            variables: {
                filter: 'ALL'
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Cleared all notifications.")
                onClose()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <>
            <div className="cm-height100" style={{overflow: "hidden"}}>
                <div className="j-slider-push-close cm-flex-align-center" style={{backgroundColor: "#f7f7f7"}}>
                    <MaterialSymbolsRounded font="keyboard_tab" size="22" onClick={onClose} className="cm-cursor-pointer cm-flex"/>
                </div>
                <div className="j-notifications-header cm-flex-space-between">
                    <span className="cm-font-fam500 cm-flex-align-center">Notifications</span>
                    {
                        <Space>
                            {unreadCount > 0 &&  <Tooltip placement="left" title="Mark all as read"><div className="j-icon-wrap" onClick={markAllAsRead}><MaterialSymbolsRounded className="cm-cursor-pointer" font="done_all" size="20" /></div></Tooltip>}
                            {data.notifications.length > 0 && <Tooltip placement="left" title="Clear notifications"><div className="j-icon-wrap" onClick={clearAllNotifications}><MaterialSymbolsRounded className="cm-cursor-pointer" font="clear_all" size="20"/></div></Tooltip>}
                        </Space>
                    }
                </div>
                <div className="j-notifications-body">
                    {
                        data.notifications.length > 0 ?
                            <List size="small" itemLayout="horizontal" className="j-notification-list">
                                {
                                    data.notifications.map((_notification: any) => (
                                        <List.Item
                                            key         =   {_notification.uuid}
                                            className   =   {(_notification.status === "READ" ? "" : "j-unread-notifications")}
                                        >
                                            <NotificationCard notification={_notification} onResourceNotificationClick={(resource: any) => handleResourceOnClick(resource)}/>
                                        </List.Item>
                                    ))
                                }
                            </List>
                        :
                            <div className="cm-height100 cm-empty-text cm-flex-center">
                                No unread notifications
                            </div>
                    }
                </div>
            </div>
            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default NotificationsPanel
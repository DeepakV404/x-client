import { useQuery } from "@apollo/client";
import { List, Space, Tooltip } from "antd";

import { useBuyerResourceViewer } from "../../custom-hooks/resource-viewer-hook";
import { BUYER_NOTIFICATIONS } from "./api/notification-query";
import { NotificationAgent } from "./api/notification-agent";
import { ERROR_CONFIG } from "../../config/error-config";
import { CommonUtil } from "../../utils/common-util";

import BuyerResourceViewerModal from "../../buyer-view/pages/resource-viewer/buyer-resource-viewer-modal";
import SomethingWentWrong from "../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import NotificationCard from "./notification-card";
import Translate from "../../components/Translate";
import Loading from "../../utils/loading";

const NotificationsPanel = (props: {unreadCount: number, onClose: any}) => {

    const { unreadCount, onClose }   =   props;

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const { data, loading, error }  =   useQuery(BUYER_NOTIFICATIONS, {
        variables: {
            filter  :  'ALL'
        },
        fetchPolicy: "network-only"
    });

    const markAllAsRead = () => {
        NotificationAgent.markAllAsRead({
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
        NotificationAgent.clearAllNotifications({
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

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return (
        <>
            <div className="cm-height100" style={{overflow: "hidden"}}>
                <div className="j-slider-push-close cm-flex-align-center" style={{backgroundColor: "#f7f7f7"}}>
                    <MaterialSymbolsRounded font="keyboard_tab" size="22" onClick={onClose} className="cm-cursor-pointer cm-flex"/>
                </div>
                <div className="j-notifications-header cm-flex-space-between">
                    <span className="cm-font-fam500"><Translate i18nKey={"common-labels.notifications"}/></span>
                    <Space>
                        {unreadCount > 0 &&  <Tooltip placement="left" title="Mark all as read"><div className="j-icon-wrap" onClick={markAllAsRead}><MaterialSymbolsRounded className="cm-cursor-pointer" font="done_all" size="20" /></div></Tooltip>}
                        {data._pNotifications.length > 0 && <Tooltip placement="left" title="Clear notifications"><div className="j-icon-wrap" onClick={clearAllNotifications}><MaterialSymbolsRounded className="cm-cursor-pointer" font="clear_all" size="20"/></div></Tooltip>}
                    </Space>
                </div>
                <div className="j-notifications-body">
                    {
                        data._pNotifications.length > 0 ?
                            <List size="small" itemLayout="horizontal" className="j-notification-list">
                                {
                                    data._pNotifications.map((_notification: any) => (
                                        <List.Item
                                            key         =   {_notification.uuid}
                                            className   =   {(_notification.status === "READ" ? "" : "j-unread-notifications")}
                                        >
                                            <NotificationCard notification={_notification} onResourceNotificationClick={(resource: any) => handleResourceOnClick(resource)} onClose={onClose}/>
                                        </List.Item>
                                    ))
                                }
                            </List>
                        :
                            <div className="cm-height100 cm-empty-text cm-flex-center">
                                <Translate i18nKey={"notifications.no-notifications"}/>
                            </div>
                    }
                </div>
            </div>
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default NotificationsPanel
import { useContext, useState } from "react";
import { Badge } from "antd";
import { useQuery } from "@apollo/client";

import { NOTIFICATION_STATS } from "../../pages/notifications/api/notification-query";
import { NotificationAgent } from "../../pages/notifications/api/notification-agent";
import { ERROR_CONFIG } from "../../config/error-config";
import { CommonUtil } from "../../utils/common-util";
import { GlobalContext } from "../../globals";

import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import NotificationDrawer from "./notification-drawer";

const Notifications = () => {

    const { $orgDetail }    =   useContext(GlobalContext);

    const [showNotifyModal, setShowNotifyModal] = useState(false);

    const { data } = useQuery(NOTIFICATION_STATS, {
        variables: {
            filter: 'ALL'
        }
    }); 
    
    const markAllAsViewed = () => {
        NotificationAgent.s_markAllAsViewed({
            variables: {
                filter: 'ALL'
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    const handleIconClick = () => {
        setShowNotifyModal(true);
        markAllAsViewed();
    };

    return (
        <>
            <div className="j-app-header-icon">
                <Badge size="small" count={data?.notificationStats?.badgeCount} offset={[0, 0]} className="cm-flex-center">
                    <MaterialSymbolsRounded color={`${($orgDetail.type === "VENDOR") ? "#000" : "#fff"}`} className="cm-flex cm-cursor-pointer" font={"notifications_active"} size="22" onClick={handleIconClick} />
                </Badge>
            </div>
            <NotificationDrawer isOpen={showNotifyModal} onClose={() => setShowNotifyModal(false)} unreadCount={data?.notificationStats?.unreadCount ? data?.notificationStats?.unreadCount : 0}/>
        </>
    );
};

export default Notifications;

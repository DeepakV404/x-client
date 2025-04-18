import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Badge } from "antd";

import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import NotificationDrawer from "./notification-drawer";

import { BUYER_NOTIFICATIONS_COUNT } from "./api/notification-query";
import { NotificationAgent } from "./api/notification-agent";
import { ERROR_CONFIG } from "../../config/error-config";
import { CommonUtil } from "../../utils/common-util";

const Notifications = () => {

    const [showNotifyModal, setShowNotifyModal] = useState(false);

    const { data } = useQuery(BUYER_NOTIFICATIONS_COUNT, {
        variables: {
            filter: 'ALL'
        }
    });

    const markAllAsViewed = () => {
        NotificationAgent.markAllAsViewed({
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
            <Badge size="small" count={data?._pNotificationStats?.badgeCount} offset={[-7, 0]} className="cm-flex-center">
                <MaterialSymbolsRounded className="cm-flex cm-cursor-pointer cm-margin-right5" font={"notifications_active"} size="22" onClick={handleIconClick} />
            </Badge>
            <NotificationDrawer isOpen={showNotifyModal} onClose={() => setShowNotifyModal(false)} unreadCount={data?._pNotificationStats?.unreadCount ? data?._pNotificationStats?.unreadCount : 0} />
        </>
    );
};

export default Notifications;

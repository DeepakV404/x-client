import { FC } from 'react';
import { Drawer } from 'antd';

import NotificationsPanel from './notifications-panel';

interface NotificationProps
{
    isOpen              :   boolean;
    onClose             :   () => void;
    unreadCount         :   number;
}

const NotificationDrawer: FC<NotificationProps> = (props) => {
    
    const { isOpen, onClose }   =   props;

    return (     
        <Drawer
            rootClassName   =   'j-notification-slider-root'
            className       =   'j-notification-slider'
            width           =   {500}
            onClose         =   {onClose}
            open            =   {isOpen}
            styles          =   {{header: {display: "none"}}}
            zIndex          =   {999}
        >
            {
                isOpen && 
                    <NotificationsPanel {...props}/>
            }
        </Drawer>
    )
}

export default NotificationDrawer;
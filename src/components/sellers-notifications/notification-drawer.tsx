import { FC } from 'react';
import { Drawer } from 'antd';
import NotificationsPanel from './notification-panel';


interface NotificationProps
{
    isOpen      :   boolean;
    onClose     :   () => void;
    unreadCount :   number;
}

const NotificationDrawer: FC<NotificationProps> = (props) => {
    
    const { isOpen, onClose }   =   props;

    return (     
        <Drawer
            width       =   {500}
            onClose     =   {onClose}
            open        =   {isOpen}
            styles      =   {{header: {display: "none"}}}
            className   =   'j-notification-slider'
            zIndex      =   {999}
        >
            {
                isOpen && 
                    <NotificationsPanel {...props}/>
            }
        </Drawer>
    )
}

export default NotificationDrawer;
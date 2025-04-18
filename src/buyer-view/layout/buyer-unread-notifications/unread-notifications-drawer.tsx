import { Drawer } from 'antd'

import UnreadNotificationBody from '.';

const UnreadNotificationsDrawer = (props: {open: boolean, onClose: () => void, notifications: any, handleMessageOpen: any}) => {

    const { open }   =   props;
    
    return (
        <Drawer 
            width           =   {500}
            rootClassName   =   'j-buyer-unread-noti-slider'
            className       =   'j-buyer-unread-noti-slider-body'
            open            =   {open}
            footer          =   {null}
            closable        =   {false}
            
        >
            {open && <UnreadNotificationBody {...props}/>}
        </Drawer>
    )
}

export default UnreadNotificationsDrawer
import { useQuery } from '@apollo/client';
import { Badge, FloatButton, Popover } from 'antd';

import { CommonUtil } from '../../../utils/common-util';
import { ERROR_CONFIG } from '../../../config/error-config';
import { NotificationAgent } from '../../../pages/notifications/api/notification-agent';
import { BUYER_NOTIFICATIONS_COUNT } from '../../../pages/notifications/api/notification-query';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import ChatWindow from './chat-window';

const BuyerChatWidgetPopover = (props: {handleMessageOpen: any, handleMessagesClose: any, isMessagePopoverOpen : any, setIsMessagePopoverOpen: any, isMobile: boolean}) => {

    const { handleMessageOpen, handleMessagesClose, isMessagePopoverOpen, setIsMessagePopoverOpen, isMobile }     =   props;

    const { data } = useQuery(BUYER_NOTIFICATIONS_COUNT, {
        variables: {
            filter: 'MESSAGE'
        }
    });
    
    const markAllAsRead = () => {
        NotificationAgent.markAllAsRead({
            variables: {
                filter: 'MESSAGE'
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    const markAllAsViewed = () => {
        NotificationAgent.markAllAsViewed({
            variables: {
                filter: 'MESSAGE'
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    const handleMessagePopoverClose = () => {
        handleMessagesClose();
    }

    const handleMessagePopoverOpen = () => {
        handleMessageOpen();
        markAllAsRead();
        markAllAsViewed();
    }

    return (
        <Popover 
            rootClassName   =   "j-chat-popover" 
            placement       =   "topRight"
            content         =   {<ChatWindow isMobile={isMobile} handleMessagesClose={handleMessagesClose}/>} 
            trigger         =   "click"
            arrow           =   {false} 
            open            =   {isMessagePopoverOpen}
            onOpenChange    =   {(open) => {
                setIsMessagePopoverOpen(open);
                if(!open){
                    handleMessagesClose();
                }else{
                    handleMessageOpen();
                }
            }}
        >
            <FloatButton 
                rootClassName   =   "j-buyer-chat-widget" 
                className       =   "cm-flex-center cm-cursor-pointer"
                onClick         =   {isMessagePopoverOpen ? handleMessagePopoverClose : handleMessagePopoverOpen}
                icon            =   {
                    isMessagePopoverOpen ?
                        <MaterialSymbolsRounded font="close" className='j-buyer-message-close-icon' size="28"/>
                    :
                        <Badge size="small" dot={data?._pNotificationStats?.badgeCount} offset={[0, 0]} className="j-buyer-message-chat-badge cm-flex-center">
                            <MaterialSymbolsRounded font="chat" className='j-buyer-message-chat-icon' filled size="28"/>
                        </Badge>
                }
                type            =   "primary" 
                style           =   {{ right: 30, bottom: 30, width: "50px", height: "50px" }} 
            />
        </Popover>
    )
}

export default BuyerChatWidgetPopover
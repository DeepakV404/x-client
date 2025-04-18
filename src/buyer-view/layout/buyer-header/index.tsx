import { useContext, useState } from 'react';
import { Avatar, Button, Layout, List, Divider, Modal, Space, message } from 'antd';


import { ACME_FALLBACK_ICON, COMPANY_FALLBACK_ICON } from '../../../constants/module-constants';
import { TEMPLATE_PREVIEW } from '../../config/buyer-constants';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { CommonUtil } from '../../../utils/common-util';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import EmptyText from '../../../components/not-found/empty-text';
import UserQuickView from '../../components/user-quick-view';
import Notifications from '../../../pages/notifications';
import InviteModal from '../../pages/invite-form/modal';
import Translate from '../../../components/Translate';
import YourPeople from './your-people';

const { Header } = Layout;

const BuyerHeader = (props: {setShowPreviewForm: any; showPreviewForm: boolean, collapsed: boolean, isMobile: boolean, showCollapseIcon: any, handleSiderOpen: any}) => {
    
    const { setShowPreviewForm, collapsed, isMobile, showCollapseIcon, handleSiderOpen }   =   props;

    const { $buyerData }    =   useContext<any>(BuyerGlobalContext);

    // const { data } = useQuery(BUYER_NOTIFICATIONS_COUNT, {
    //     variables: {
    //         filter: 'MESSAGE'
    //     }
    // });

    const $isTemplatePreview    =   $buyerData?.portalType === TEMPLATE_PREVIEW;

    const [showInviteModal, setShowInviteModal]     =   useState(false);
    const [showManageBuyers, setShowManageBuyers]   =   useState(false);

    // const markAllAsRead = () => {
    //     NotificationAgent.markAllAsRead({
    //         variables: {
    //             filter: 'MESSAGE'
    //         },
    //         onCompletion: () => {},
    //         errorCallBack: (error: any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     });
    // };

    // const markAllAsViewed = () => {
    //     NotificationAgent.markAllAsViewed({
    //         variables: {
    //             filter: 'MESSAGE'
    //         },
    //         onCompletion: () => {},
    //         errorCallBack: (error: any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     });
    // };

    // const handleGlobalCommentsSlider = () => {
    //     markAllAsRead();
    //     markAllAsViewed();
    //     handleMessageOpen();
    // }

    let activeUsers     =   $buyerData?.buyers.filter((_filterStakeholder: any) => !_filterStakeholder.isCurrentBuyer && _filterStakeholder.status === "ACTIVE");
    let invitedUsers    =   $buyerData?.buyers.filter((_filterStakeholder: any) => !_filterStakeholder.isCurrentBuyer && _filterStakeholder.status === "INVITED");

    return (
        <>
            <Header className='j-buyer-header cm-flex-space-between'> 
                <Space size={isMobile ? 10 : 20}>
                    {
                        showCollapseIcon && collapsed ?
                            <div className="j-buyer-sider-open-icon" onClick={handleSiderOpen}>
                                <MaterialSymbolsRounded font="menu" color="#000000D9" size="20" filled/>
                            </div>
                        :
                            null
                    }
                    <Space className='cm-flex-center' size={8}>
                        <div className='j-buyer-logo-wrap cm-flex-center'>
                            <img src={$isTemplatePreview ? ACME_FALLBACK_ICON : $buyerData?.logoUrl} style={{objectFit: "scale-down"}} className="j-header-logo" alt={$buyerData?.companyName} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= $isTemplatePreview ? ACME_FALLBACK_ICON : COMPANY_FALLBACK_ICON;}}/>
                        </div>
                        <span className='cm-font-size24'>+</span>
                        <div className='j-buyer-logo-wrap cm-flex-center'>
                            <img src={$buyerData?.sellerAccount.logoUrl} className="j-header-logo" style={{objectFit: "scale-down"}} alt={$buyerData?.sellerAccount.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON}}/>
                        </div>
                    </Space>
                </Space>
                <Space size={20} className='j-buyer-header-actions'>
                    {
                        (activeUsers.length > 0 || invitedUsers.length > 0) &&
                            <Space size={5} className='cm-cursor-pointer cm-flex' onClick={() => setShowManageBuyers(true)} >
                                <Avatar.Group className='cm-flex-align-center' max={{count: isMobile ? 1 : 7}} rootClassName='j-buyer-header-avatar-root'>
                                    {
                                        activeUsers.map((_stakeHolder: any) => (
                                            <UserQuickView key={_stakeHolder.uuid} user={_stakeHolder}>
                                                <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px" }} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : null}>
                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                                </Avatar>
                                            </UserQuickView>
                                        ))
                                    }
                                </Avatar.Group>
                                {
                                    (activeUsers.length > 0 && invitedUsers.length > 0) &&
                                        <Divider type="vertical" />
                                }
                                <Avatar.Group className='cm-flex-align-center' maxCount={isMobile ? 1 : 7} rootClassName='j-buyer-header-avatar-root'>
                                    {
                                        invitedUsers.map((_stakeHolder: any) => (
                                            <UserQuickView key={_stakeHolder.uuid} user={_stakeHolder}>
                                                <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", opacity:"50%" }} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : null}>
                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                                </Avatar>
                                            </UserQuickView>
                                        ))
                                    }
                                </Avatar.Group>
                            </Space>
                    }
                    {/* Notifications */}
                    <Notifications />
                    {/* Notifications */}
                    <Button 
                        onClick     =   {() => 
                            {
                                if($isTemplatePreview || CommonUtil.__getQueryParams(window.location.search).preview === "true"){
                                    setShowPreviewForm(false)
                                    message.warning({className: "", content : "This preview is just for viewing"})
                                }else{
                                    setShowInviteModal(true)
                                }
                            }
                        }     
                        className   =   'cm-flex-center' 
                        type        =   'primary' 
                        icon        =   {<MaterialSymbolsRounded className='cm-button-icon' font='person_add' size='20'/>}
                    >
                        <div><Translate i18nKey={"common-labels.share"}/></div>
                    </Button>
                    {/* {
                        !showMessages && ($buyerData.sellerAccount.tenantName !== "kissflow") && $buyerData.properties.isMessageEnabled &&
                            <Badge size="small" count={data?._pNotificationStats?.badgeCount} offset={[0, 0]} className="cm-flex-center">
                                <MaterialSymbolsRounded className="cm-flex cm-cursor-pointer" font="chat" weight="250" onClick={handleGlobalCommentsSlider}/>
                            </Badge>
                    } */}
                </Space>
            </Header>
            <InviteModal
                isOpen  =   {showInviteModal}
                onClose =   {() => setShowInviteModal(false)}
            />
            <Modal
                centered
                width           =   {550}
                open            =   {showManageBuyers}
                onCancel        =   {() => setShowManageBuyers(false)}
                footer          =   {null}
                destroyOnClose  =   {true}
                className       =   'cm-bs-custom-modal'
            >
                <div className="cm-width100">
                    <div className="cm-font-size16 cm-flex-align-center cm-modal-header cm-font-fam500"><Translate i18nKey='invite-form.your-people'/></div>
                    <List
                        className='j-share-room-link-wrap cm-padding-inline15'
                        itemLayout  =   "horizontal"
                        dataSource  =   {$buyerData?.buyers.filter((_buyer: any) => !_buyer.isCurrentBuyer)}
                        locale      =   {{
                            emptyText:  <div className='cm-flex-center' style={{height: "300px"}}><EmptyText text='No  other users found'/></div>
                        }}
                        renderItem  =   {(_buyer: any) => (
                            <List.Item key={_buyer.uuid}>
                                <YourPeople seller={_buyer}/>
                            </List.Item>
                        )}
                    />
                </div>
            </Modal>
        </>
    );
};

export default BuyerHeader;
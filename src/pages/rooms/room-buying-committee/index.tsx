import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { useOutletContext } from "react-router-dom";
import { Button, Col, Divider, Dropdown, List, MenuProps, Row, Space, Tabs, message } from 'antd';

import { CRM_INTEGRATION_CONFIG } from '../../settings/config/integration-type-config';
import { R_BUYER_PORTAL_LINKS } from '../../accounts/api/accounts-query';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { PermissionCheckers } from '../../../config/role-permission';
import { AccountsAgent } from '../../accounts/api/accounts-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { BUYER, NO_BUYERS } from '../../../constants/module-constants';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

// import EmptyText from '../../../components/not-found/empty-text';
import ShareRoomModal from '../../accounts/account-room-view/share-room/share-room-modal';
import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import CRMAddContactModal from '../room-layout/crm-add-contact-modal';
import BuyerActivityContent from './buyer-activity-content';
import ListItemHeader from './buyer-list-item-header';
import BuyerContentInfo from './buyer-content-info';
import BuyerInfoCard from './buyer-info-card';
import Loading from '../../../utils/loading';
import BuyerDetails from './buyer-details';

const { TabPane }   =   Tabs;

const RoomBuyingCommittee = () => {

    const { room }     =   useOutletContext<any>()
    const params       =   useParams();

    const { $user, $orgDetail, $dictionary }             =    useContext(GlobalContext);

    const [currentBuyer, setCurrentBuyer]   =   useState<any>();
    
    const [showShare, setShowShare]         =   useState({
        visibility  :   false,
        inviteType  :   ""   
    });

    const [showSyncModal, setShowSyncModal] =   useState(false);

    const { data ,loading, error }   =  useQuery(R_BUYER_PORTAL_LINKS, {
        variables: {
            roomUuid    :   params.roomId
        },
        fetchPolicy: "network-only"
    });   

    const EditBuyerPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    useEffect(() => {
        if(data && data._rBuyerPortalLinks.length > 0 && !currentBuyer){
            setCurrentBuyer(data._rBuyerPortalLinks[0])
        }
    }, [data, currentBuyer])
    
    const onUpdateBuyer = (updatedBuyer: any) => {
        setCurrentBuyer(updatedBuyer);
    };

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    const onSelectBuyer = (buyer: any) => {
        setCurrentBuyer(buyer)
    } 
    
    const handleResendLink = (event: any) => {
        event.stopPropagation()
        const loader = message.loading("Sending link...", 0)
        AccountsAgent.sendRoomLink({
            variables: {
                roomUuid: params.roomId, 
                contactUuid: currentBuyer.uuid
            },
            onCompletion: () => {
                loader()
                CommonUtil.__showSuccess("Link sent successfully")
            },
            errorCallBack: (error: any) => {
                loader()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }      
        })
    }

    const addBuyerOptions: MenuProps['items'] = [
        {
            key     :   'invite_buyer',
            label   :   (
                <Space style={{ minWidth: "130px" }} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font='person_add' size='18'/>
                    Invite {$dictionary.buyers.singularTitle}
                </Space>
            ),
            onClick: (event) => {
                event.domEvent.stopPropagation();
                setShowShare({visibility: true, inviteType: BUYER})
            }
        },
        room?.crmInfo ?
        {
            key     :   'add_from_crm',
            label   :   (
                <Space style={{ minWidth: "130px" }} className='cm-flex' size={5}>
                    <div className="cm-flex-align-center">{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <img width={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} height={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/> : null}</div>
                    Add from CRM
                </Space>
            ),
            onClick: (event) => {
                event.domEvent.stopPropagation();
                setShowSyncModal(true)
            }
        }   : null,
    ]

    return (
        <>
            <div className='cm-padding15 cm-height100'>
                <Row className="cm-width100 cm-height100 j-room-settings-layout cm-margin0" gutter={20}>
                    {
                        data._rBuyerPortalLinks.length > 0 
                        ?
                            <>
                                <Col flex="300px" className="j-room-buyers-side-nav cm-height100" style={{ padding: "0px" }}>
                                    <div className='cm-width100 cm-height100'>
                                        <Space className='cm-flex-align-center cm-flex-space-between cm-width100 cm-padding10'>
                                            <div className='cm-font-fam500 cm-font-size15'>{$dictionary.buyers.title}</div>
                                            <Dropdown menu={{ items: addBuyerOptions }} trigger={["click"]} placement="bottom">
                                                <Space size={4} className='cm-link-text cm-font-size13 cm-cursor-pointer'>
                                                    <MaterialSymbolsRounded font='add' size='18' weight='400'/>
                                                    Add {$dictionary.buyers.title}
                                                </Space>
                                            </Dropdown>  
                                        </Space>
                                        <div className='j-buying-committee-list'>
                                            <List
                                                itemLayout  =   "horizontal"
                                                dataSource  =   {data._rBuyerPortalLinks}
                                                rowKey      =   {(_buyer: any) => _buyer.uuid}
                                                renderItem  =   {(_buyer: any) =>  <BuyerInfoCard currentBuyer={currentBuyer} buyer={_buyer} onClick={(buyer) => onSelectBuyer(buyer)}/> }
                                            />
                                        </div>
                                    </div>
                                </Col>
                                
                                <Col flex="auto" style={{maxWidth: "calc(100% - 300px)"}} className="cm-height100 cm-overflow-auto cm-padding20" >
                                    {
                                        currentBuyer ?
                                            <>
                                                <ListItemHeader buyer={currentBuyer} onUpdateBuyer={onUpdateBuyer} roomData={room}/>
                                                <Divider/>
                                                {
                                                    currentBuyer?.status === "ACTIVE"
                                                    ?
                                                        <>
                                                            <BuyerDetails buyer={currentBuyer}/>
                                                            <Tabs className='cm-margin-top10'>
                                                                <TabPane className='cm-font-fam500 cm-margin-top20 cm-margin-bottom10' tab="Activities" key='activities'>                                                            
                                                                    <BuyerActivityContent buyer={currentBuyer}/>                                                            
                                                                </TabPane>
                                                                <TabPane className='cm-font-fam500 cm-margin-top20 cm-margin-bottom10' tab="Content Engagement" key="resource_engagement">
                                                                    <BuyerContentInfo buyer={currentBuyer}/>
                                                                </TabPane>
                                                            </Tabs>
                                                        </>
                                                    :
                                                        currentBuyer?.status === "IN_ACTIVE" ?
                                                            <div style={{height: "calc(100% - 110px)"}} className='cm-flex-center cm-empty-text'>Access revoked</div>
                                                        :  
                                                            <>
                                                                <Space style={{height: "calc(100% - 110px)"}} direction='vertical' size={20} className='cm-flex-center cm-empty-text cm-flex-direction-column'>
                                                                    <div>{$dictionary.buyers.singularTitle} has not accepted the invite</div>
                                                                    {
                                                                        EditBuyerPermission &&
                                                                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={handleResendLink} icon={<MaterialSymbolsRounded font="forward" size="16"/>}>
                                                                                <div className="cm-font-size14">Resend Invite</div>
                                                                            </Button>
                                                                    }
                                                                </Space>
                                                            </>
                                                }
                                            </>
                                        :
                                            <div className='cm-empty-text'>Select a buyer</div>
                                    }
                                </Col>
                
                            </>
                        :
                         <Space direction="vertical" className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-height100 cm-overflow-auto">
                            <img src={NO_BUYERS} alt="No next steps found" className="cm-margin-bottom15" width={160} height={160}/>
                            <div className="cm-font-size18 cm-font-fam500">No contacts in the Buying Committee</div>
                            <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                                Invite contacts to collaborate and make smarter decisions together.
                            </div>
                            {
                                EditBuyerPermission &&
                                    <Dropdown menu={{ items: addBuyerOptions }} trigger={["click"]} placement="bottom">
                                        <Button type='primary' className='cm-margin-top15'>
                                            Add Contacts
                                        </Button>
                                    </Dropdown>
                            }
                        </Space>
                    }
                </Row>
            </div>
            <ShareRoomModal isOpen={showShare.visibility} onClose={() => setShowShare({visibility: false, inviteType: ""})} inviteType={showShare.inviteType} roomData={room}/>
            <CRMAddContactModal
                isOpen  =   {showSyncModal}
                onClose =   {() => setShowSyncModal(false)}
                room    =   {room}
            />
        </>
    )
}

export default RoomBuyingCommittee
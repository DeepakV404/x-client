import { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { LinkedinFilled, TwitterOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Dropdown, Form, Input, MenuProps, Space, Tabs, Tag, Tooltip, Tour, TourProps, Typography, theme } from 'antd';

import { ACCOUNT_TYPE_DPR, BUYER, Length_Input, SELLER } from '../../../constants/module-constants';
import { CRM_INTEGRATION_CONFIG } from '../../settings/config/integration-type-config';
// import { NOTIFICATION_STATS } from '../../notifications/api/notification-query';
import { ADD_RESOURCE_CONFIG } from '../../library/config/add-resource-config';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { checkPermission } from '../../../config/role-permission';
import { SIMPLE_ACCOUNT } from '../../accounts/api/accounts-query';
import { ROOM_STAGES } from '../../settings/api/settings-query';
import { ROOM_RESOURCE_ADDED } from '../../../tracker-constants';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { AppTracker } from '../../../app-tracker';
import { GlobalContext } from '../../../globals';
import { RoomsAgent } from '../api/rooms-agent';
import { AppContext } from '../../../layout';
import { ROOM } from '../api/rooms-query';

import RoomSettingsModal, { RoomSettingsProps } from '../room-settings/room-settings-modal';

import ShareRoomModal from '../../accounts/account-room-view/share-room/share-room-modal';
import GetRoomEngagementStatus from '../../../components/get-room-engagement-status';
import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import HandoffConfirmation from '../room-header/handoff/handoff-confirmation';
import CompanyAvatar from '../../../components/avatars/company-avatar';
import ManageSellerModal from '../room-sellers/manage-seller-modal';
import ResourceModal from '../library/resource-form/resource-modal';
import LibraryModal from '../library/library-modal/library-modal';
import CRMMapRoomModal from './crm-map-room-modal';
import RoomLinkModal from './copy-link-modal';
import Loading from '../../../utils/loading';
import UpgradeIcon from '../../../components/upgrade-icon';

const { useForm }   =   Form;
const { Text }      =   Typography;
const { TabPane }   =   Tabs;

export function useRoomContext() {
    return useOutletContext<any>();
}

interface RoomStageType{
    uuid                    :   string;
    label                   :   string;
    isCRMDealStageMapped    :   boolean
    properties              :   {
        color: string;
    };
}

const RoomLayout = () => {

    const { token: { colorPrimary } }   =   theme.useToken();

    const navigate      =   useNavigate();
    const location      =   useLocation();
    const params        =   useParams();
    const [form]        =   useForm();

    const [searchParams, setSearchParams] =   useSearchParams();

    const tourStep1Ref       =   useRef(null);
    const tourStep2Ref       =   useRef(null);
    const tourStep3Ref       =   useRef(null);
    const tourStep4Ref       =   useRef(null);
    
    const { $orgDetail, $user, $isVendorMode, $isVendorOrg, $dictionary, $featData, $accountType, hidebackinAP, setHidebackinAP } =   useContext(GlobalContext);

    const { fromPath }  =   useContext<any>(AppContext);

    const [showTour, setShowTour]                               =   useState(false);

    const [showManageUsers, setShowManageUsers]                 =   useState(false);
    const [editView, setEditView]                               =   useState(false);
    const [showLibraryModal, setShowLibraryModal]               =   useState(false);
    const [showLinkModal, setShowLinkModal]                     =   useState(false);
    const [showSyncModal, setShowSyncModal]                     =   useState(false);
    const [showSettingsModal, setShowSettingsModal]             =   useState(false);

    useEffect(() => {
        searchParams.get("onboarded") === "true" ?
            setTimeout(() => {
                setShowTour(true)
            }, 2000)
        :
            null
    }, [searchParams])

    const [showConfirmation, setShowConfirmation]               =   useState<any>({
        visibility  :   false,
        option      :   ""
    });

    const [showShare, setShowShare]                             =   useState({
        visibility  :   false,
        inviteType  :   ""   
    });

    const [isModalOpen, setIsModalOpen]                         =   useState({
        isOpen          :   false,
        type            :   "",
        key             :   "",
        displayname     :   "",
        domain          :   "",
        imageIcon       :   ""
    });

    // Queries
    
    // const { data: message }                                         =   useQuery(NOTIFICATION_STATS, {
    //     variables: {
    //         roomUuid : params.roomId,
    //         filter: 'MESSAGE'
    //     },
    //     fetchPolicy: "network-only"
    // });

    const { data, loading, error }                                  =   useQuery(SIMPLE_ACCOUNT, {
        variables: {
            accountUuid :   params.accountId    
        },
        fetchPolicy: "network-only",
    });

    const { data: rData, loading: rLoading, error: rError }         =   useQuery(ROOM, {
        variables: {
            roomUuid    :   params.roomId
        },
        fetchPolicy: "network-only"
    })

    const { data: stageData }    =   useQuery<{ roomStages: RoomStageType[] | []}>(ROOM_STAGES, {
        skip: ($isVendorMode || $isVendorOrg)
    });
    
    // Queries

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        CommonUtil.__showSuccess("Link copied successfully!")
    }

    const handleSegmentChange = (key: any) => {
        setHidebackinAP(true)
        navigate(key)
    }

    const showMessages = () => {
        if($orgDetail.tenantName !== "kissflow" || $featData?.messages?.isRestricted){
            return true
        }
        return false
    }

    const accountTabs = [
        {
            label   :   <Space className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13 j-account-segment-item`}><MaterialSymbolsRounded font="view_agenda" size="17"/>{$accountType === ACCOUNT_TYPE_DPR ? "Pod" : "Room"}</Space>,
            value   :   'sections',
        },
        !($isVendorMode || $isVendorOrg) ?
        {
            label   :   <Space className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13 j-account-segment-item`}><MaterialSymbolsRounded font="room_preferences" size="19"/>Action Plan</Space>,
            value   :   'collaboration',
        } : null,
        {
            label   :   <Space ref={tourStep4Ref} className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13 j-account-segment-item`}><MaterialSymbolsRounded font="analytics" size="19"/>Analytics</Space>,
            value   :   'insights',
        },
        {
            label   :   <Space className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13 j-account-segment-item`}><MaterialSymbolsRounded font="query_stats" size="19"/>Executive Dashboard {$featData?.room_executive_dashboard?.isRestricted ? <UpgradeIcon/> : null}</Space>,
            value   :   'executive-dashboard',
        },
        {
            label   :   <Space className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13 j-account-segment-item`}><MaterialSymbolsRounded font="home_storage" size="19"/>Attachments</Space>,
            value   :   'resources',
        },
        {
            label   :   <Space className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13 j-account-segment-item`}><MaterialSymbolsRounded font="groups" size="19"/>{$dictionary.buyingCommittee.title}</Space>,
            value   :   'buying_committee',
        },
        {
            label   :   <Space className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13 j-account-segment-item`}><MaterialSymbolsRounded font="description" size="19"/>Notes</Space>,
            value   :   'notes',
        },
        showMessages() ? 
        {
            label   :   <Space 
                            style       =   {(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app") ? { paddingRight: "8px"} : {}} 
                            className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-align-center" : "cm-flex-center"} cm-font-size13  j-account-segment-item j-tab-badge-hover ${location.pathname.split("/")[4] === "messages" ? "j-tab-active" : ""} ${$featData?.messages?.isRestricted ? "cm-text-dark" : ""}`}
                        >
                            {/* <Badge size="small" count={message?.notificationStats?.badgeCount} offset={[0, 0]} className={`${$featData?.messages?.isRestricted ? "cm-cursor-disabled cm-dark-text" : "cm-cursor-pointer"} cm-flex-center`}> */}

                            {/* Removed this because we are adding widget comments as messages from client. so this is removed as it will cause a count mismatch */}

                                <MaterialSymbolsRounded font="comment" size="19" className={`${$featData?.messages?.isRestricted ? "" : "j-tab-badge-hover-icon"}`}/>
                            {/* </Badge> */}
                            Messages {$featData?.messages?.isRestricted ? <UpgradeIcon/> : null}
                        </Space>,
            value   :   'messages',
            disabled  :  Boolean($featData?.messages?.isRestricted)
        } : null,

    ].filter(Boolean);

    if(loading || rLoading) return <Loading/>
    if(error || rError) return <SomethingWentWrong/>

    const handleGoBack = () => {
        if(fromPath === "rooms"){
            navigate(`/${fromPath}`)
        }else if (fromPath === "accounts" && params?.accountId) {
            navigate(`/accounts/${params.accountId}`);
        }
        else{
            navigate(`/rooms`)
        }
    }

    const account: any = rData.room.buyerAccount;    

    const inviteOptions: MenuProps['items'] = [
        {
            key     : 'inviteBuyer',
            icon    :   <MaterialSymbolsRounded font='person_add' size='16'/>,
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    Invite Contacts
                </Space>
            ),
            onClick :   () => {
                setShowShare({
                    visibility  :   true,
                    inviteType  :   BUYER
                })
            }
        },
        {
            key     : 'addUser',
            icon    :   <MaterialSymbolsRounded font='group_add' size='16'/>,
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    Add Team Members
                </Space>
            ),
            onClick :   () => {
                setShowShare({
                    visibility  :   true,
                    inviteType  :   SELLER
                })
            }
        },   
        {
            key     : 'preview',
            icon    :   <MaterialSymbolsRounded font='open_in_new' size='16'/>,
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    Preview Room
                </Space>
            ),
            onClick :   () => {
                window.open(rData.room.previewLink, "_blank")
            }
        },    
        {
            key     : 'copyLink',
            icon    :   <MaterialSymbolsRounded font='link' size='16'/>,
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    {($isVendorMode || $isVendorOrg) ? "Copy Link" : "Copy Room Link"}
                </Space>
            ),
            onClick :   () => {
                (CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" || CommonUtil.__getSubdomain(window.location.origin) === "hs-app")
                ?
                    setShowLinkModal(true)
                :
                    copyLink(rData.room.buyerPortalLink)
            },
            disabled: !rData.room.buyerPortalLink
        },
    ]

    const addResourceOptions: MenuProps['items'] = [
        {
            "key"       :   "add_from_resource",
            "title"     :   `Select from ${$dictionary.library.title}`,
            "label"     :
                <Space style={{minWidth: "280px"}}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        <MaterialSymbolsRounded font={"home_storage"} size='25' />
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>Select from {$dictionary.library.title}</div>
                        <div className='cm-light-text cm-font-size12'>Add a resource from the {$dictionary.library.title}</div>
                    </Space>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setShowLibraryModal(true)
            }
        }
    ];

    Object.values(ADD_RESOURCE_CONFIG).map((_addResourceType) => {
        let option = {
            "key"       :   _addResourceType.key,
            "title"     :   _addResourceType.view,
            "label"     :
                <Space style={{minWidth: "280px"}}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        {
                            _addResourceType.imageIcon ?
                                <MaterialSymbolsRounded font={_addResourceType.imageIcon} size='25'/>
                            :
                                <img src={_addResourceType.imageFile} style={{width: "25px", height: "25px"}}/>
                        }
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>{_addResourceType.displayName}</div>
                        <div className='cm-light-text cm-font-size12'>{_addResourceType.description}</div>
                    </Space>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setIsModalOpen({
                    isOpen          :   true,
                    type            :   _resource.item.props.title,
                    key             :   _addResourceType.key,
                    displayname     :   _addResourceType.displayName,
                    domain          :   _addResourceType.domain ?? "",
                    imageIcon       :   _addResourceType.imageIcon ?? ""
                })
            }
        }
        addResourceOptions.push(option)
    })

    const stageOptions: MenuProps['items'] = [];

    stageData?.roomStages.map((_stage: any) => {
        let statusOption: any = {
            "key"       :   _stage.uuid,
            "title"     :   _stage.label,
            "label"     :
                    <Space>
                        <Badge color={_stage?.properties?.color}></Badge>
                        <Text style={{width: "200px"}} ellipsis={{tooltip: _stage?.label}}>{_stage?.label}</Text>
                    </Space>
            ,
            "onClick"   :   () => {
                rData?.room?.currentStage?.label !== _stage.label
                &&
                    setShowConfirmation({visibility: true, option: {key: _stage.uuid, label: _stage.label}})
            }
        }
        stageOptions.push(statusOption)
    })

    const handleSelectResource = (resources: any) => {
        RoomsAgent.updateResources({
            variables: {
                roomUuid: params.roomId,
                resourcesUuid: resources.map((_resource: any) => _resource.uuid),
                action: "ADD"
            },
            onCompletion: () => {
                setShowLibraryModal(false)
                CommonUtil.__showSuccess("Resource added successfully");
                AppTracker.trackEvent(ROOM_RESOURCE_ADDED, {});
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const onFinish = (values: any) => {

        RoomsAgent.updateRoom({
            variables: {
                roomUuid        :   params.roomId,
                input           :   {
                    title       :   values.roomName
                }
            },
            onCompletion: () => {
                setEditView(false)
                CommonUtil.__showSuccess("Room name updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
            form.submit()
        }
    }

    const handleOpenSettings = () => {
        setShowSettingsModal(true)
    }

    const roomSettings: RoomSettingsProps["roomSettings"] = {
        protection              :   rData.room.isProtected,
        discovery               :   rData.room.isDiscoveryEnabled,
        language                :   rData.room.language,
        messages                :   rData.room.properties.isMessageEnabled,
        emailNotifications      :   rData.room.properties.isMailNotificationEnabled,
        inProductNotifications  :   rData.room.properties.isInProdNotificationEnabled,
        actionPointComments     :   rData.room.properties.isCommentsEnabled
    }

    const steps: TourProps['steps'] = [
        {
          title: 'Widgets',
          description: 'Add and rearrange widgets to customize the information you share.',
          placement: "leftTop",
          target: () => tourStep1Ref.current,
        },
        {
            title: 'Preview',
            description: 'Use the preview option to see your deal room come to life as you build it.',
            placement: 'bottomLeft',
            target: () => tourStep2Ref.current,
            nextButtonProps: {
                onClick: () => {
                    window.open(rData?.room?.previewLink, "_blank")
                }
            }
          },
        {
          title: 'Share',
          description: 'Share your room with your contacts, internal team and stay in control with secure room sharing.',
          placement: 'bottom',
          target: () => tourStep3Ref.current,
        },
        {
            title: 'Analytics',
            description: 'Discover who visited your room, and what interests them the most.',
            placement: 'bottom',
            target: () => tourStep4Ref.current,
            nextButtonProps: {
                style: {
                    background: "#3EB200"
                },
                onClick: () => {
                    searchParams.delete("onboarded");
                    setSearchParams(searchParams);
                }
            }
        },
    ];

    return (
        <> 
            <Tour rootClassName='j-room-tour-root' className='j-room-tour' open={showTour} onClose={() => setShowTour(false)} steps={steps} mask={false}/>
            <Space className='j-room-header cm-width100 cm-position-relative' direction='vertical' size={3}>
                <Space className='j-room-header-top cm-flex-space-between'>
                    <Space className="j-room-header-left">
                        <MaterialSymbolsRounded font="arrow_back" className="cm-cursor-pointer cm-margin-right5 cm-margin-bottom20" color="#454545" size="22" onClick={() => handleGoBack()}/>
                        <div style={{cursor:"pointer"}} onClick={(event) => {event.stopPropagation(); navigate(`/accounts/${account.uuid}`)}}>
                            <CompanyAvatar company={account} size={46}/>
                        </div>
                        <Space direction='vertical' size={2}>
                            {
                                !($isVendorMode || $isVendorOrg) ?
                                    checkPermission($user.role, FEATURE_ROOMS, 'update') ? 
                                        (editView 
                                        ?
                                            <Form form={form} className="cm-form cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                                <Form.Item name={"roomName"} noStyle initialValue={rData.room.title} >
                                                    <Input autoFocus style={{width: "300px"}} size='small' maxLength={Length_Input} className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter}/>
                                                </Form.Item>
                                                <div className='cm-flex-center cm-cursor-pointer cm-small-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                            </Form>
                                        :
                                            <Space className='cm-flex-align-center'>
                                                <Text className="cm-font-fam500" style={{ fontWeight: 500, maxWidth: "300px"}} ellipsis={{tooltip: rData.room.title}}>{rData.room.title}</Text>
                                                <MaterialSymbolsRounded font="edit" size="15" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                            </Space>
                                        )
                                    :
                                        <Text className="cm-font-fam500" style={{ fontWeight: 500, maxWidth: "300px"}} ellipsis={{tooltip: rData.room.title}}>{rData.room.title}</Text>
                                :
                                    <Text className="cm-font-fam500" style={{ fontWeight: 500, maxWidth: "300px"}} ellipsis={{tooltip: rData?.room?.buyers[0]?.emailId ? rData.room.buyers[0]?.emailId : "-"}}>{rData?.room?.buyerAccount?.companyName} <span className='cm-font-size12 cm-secondary-text'>({rData?.room?.buyers[0]?.emailId ? rData.room.buyers[0]?.emailId : "-"})</span></Text>
                            }
                            <Space>
                                {account.industryType && <Tag className='cm-font-size11' color='blue' style={{ margin: 0, maxWidth: "175px" }}><Text className='cm-font-size11' ellipsis={{tooltip: account.industryType}} style={{color :"inherit", maxWidth: "100%"}}>{account.industryType}</Text></Tag>}
                                {rData.room.region && <Tag className='cm-font-size11' color="magenta">{rData.room.region.name}</Tag>}
                                {<GetRoomEngagementStatus roomStatus={rData?.room.engagementStatus} tagStyle={{lineHeight: "18px"}}/>}
                                {
                                    account.websiteUrl ?
                                        <MaterialSymbolsRounded className='cm-cursor-pointer cm-dark-grey-text' font='link' size='16' onClick={(event) => {event.stopPropagation(); window.open(account.websiteUrl, "_blank")}}/>
                                    :
                                        null
                                }
                                {
                                    account.linkedInUrl ?
                                        <LinkedinFilled className='cm-display-block cm-cursor-pointer cm-dark-grey-text' size={13} onClick={(event: any) => {event.stopPropagation(); window.open(account.linkedInUrl, "_blank")}}/>
                                :
                                        null
                                }
                                {
                                    account.twitterUrl ?
                                        <TwitterOutlined className='cm-display-block cm-cursor-pointer cm-dark-grey-text' size={13} onClick={(event: any) => {event.stopPropagation(); window.open(account.twitterUrl, "_blank")}}/>
                                    :
                                        null
                                }
                                {
                                    rData.room.isProtected ? 
                                        <Tooltip title={"Protected"} mouseEnterDelay={1}>
                                            <div>
                                                <MaterialSymbolsRounded font="lock" size='16' color="#0065E5"/>
                                            </div>
                                        </Tooltip>
                                :
                                    null
                                }
                                {
                                    rData?.room?.crmInfo?.url ?
                                        <Tooltip title={"Open deal in CRM"} placement='right'>
                                            <a href={rData?.room?.crmInfo?.url} target="_blank">
                                            <div className="cm-flex-align-center">{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <img width={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} height={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/> : null}</div>
                                            </a>
                                        </Tooltip>
                                    :
                                        <Tooltip title={"Map Room with CRM deals"} placement='right'>
                                            <div className="cm-flex-align-center cm-cursor-pointer" onClick={() => setShowSyncModal(true)}>
                                                {CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <img width={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} height={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/> : null}
                                            </div>
                                        </Tooltip>
                                }
                            </Space>
                        </Space>
                    </Space>
                    <Space>
                        <Space className='cm-flex'>
                            <Avatar.Group className='cm-flex-align-center cm-cursor-pointer' maxCount={3} size={30} maxPopoverPlacement="bottom" maxStyle={{fontSize: "13px"}}>
                                {
                                    rData.room.owner ?
                                        <Tooltip title="Owner" placement='bottom'>
                                            <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", border: `2px solid ${colorPrimary}` }} className='cm-flex-align-center' src={rData.room.owner.profileUrl ? <img src={rData.room.owner.profileUrl} alt={CommonUtil.__getFullName(rData.room.owner.firstName, rData.room.owner.lastName)}/> : ""}  onClick={() => setShowManageUsers(true)}>
                                                {CommonUtil.__getAvatarName(rData.room.owner.firstName, 1)}
                                            </Avatar>
                                        </Tooltip>
                                    :   
                                    null
                                }
                                {
                                    rData.room.users.filter((_filterUser: any) => !_filterUser.isOwner).map((_user: any) => (
                                        <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px"}} src={_user.profileUrl ? <img src={_user.profileUrl} alt={CommonUtil.__getFullName(_user.firstName, _user.lastName)}/> : ""} onClick={() => setShowManageUsers(true)}>
                                            {CommonUtil.__getAvatarName(_user.firstName, 1)}
                                        </Avatar>
                                    ))
                                }
                            </Avatar.Group>
                        </Space>
                        {
                            checkPermission($user.role, FEATURE_ROOMS, 'update') &&
                                <Space>         
                                    <Button ref={tourStep3Ref} className='cm-flex-center' type='primary' onClick={() => setShowShare({visibility : true, inviteType : BUYER })}>
                                        <div className='cm-font-size14'>Share</div>
                                    </Button>
                                    <Button icon={<MaterialSymbolsRounded font='settings' size='20'/>} onClick={handleOpenSettings}></Button>
                                    <Button ref={tourStep2Ref} icon={<MaterialSymbolsRounded font='visibility' size='16'/>} onClick={() => window.open(rData.room.previewLink, "_blank")}>Preview</Button>
                                    {/* <Dropdown menu={{items: addResourceOptions}} trigger={["click"]} placement='bottom' overlayClassName='cm-add-resource-dropdown'>
                                        <Button type='primary' className="cm-flex-center" icon={<MaterialSymbolsRounded font="home_storage" size="22" weight={"400"}/>} ghost style={{paddingInline: "5px"}}>
                                            <MaterialSymbolsRounded font='expand_more' size="18"/>
                                        </Button>
                                    </Dropdown>    */}
                                    {
                                        !($isVendorMode || $isVendorOrg) &&
                                            <Dropdown menu={{items: stageOptions}} trigger={["click"]} overlayStyle={{minWidth: "fit-content"}}>
                                                <Button className='cm-flex-center' style={{paddingLeft: "10px", paddingRight: "5px", border: `1px solid ${rData?.room?.currentStage?.properties?.color}` , backgroundColor: `${rData?.room?.currentStage?.properties?.color ?? "#DCDCDC"}26`}}>
                                                    <Space style={{color: `${rData?.room?.currentStage?.properties?.color}`}}>
                                                        {rData?.room?.currentStage?.label}
                                                        <MaterialSymbolsRounded font='expand_more' size='18'/>
                                                    </Space>
                                                </Button>
                                            </Dropdown>
                                    }  
                                </Space>
                        }
                    </Space>
                </Space>


                <Divider style={{marginBlock: "0px"}}/>
                <div className={`${CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" ? "cm-flex-space-between" : "cm-flex-center"} j-room-header-bottom cm-flex-align-center cm-width100`}>
                    <Tabs onChange={handleSegmentChange} defaultActiveKey={location.pathname.split("/")[4]} style={(CommonUtil.__getSubdomain(window.location.origin) !== "hs-app") ? {paddingLeft: "40px"} : {}} activeKey={hidebackinAP ? location.pathname.split("/")[4] : "sections"}>
                        {accountTabs.map((tab: any) => (
                            <TabPane className='j-room-header-segment' tab={tab.label} disabled={tab?.disabled} key={tab.value}/>
                        ))}
                    </Tabs>
                    <Space>
                        {/* {
                            $orgDetail.tenantName !== "kissflow" && 
                                <Space size={4} style={(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app") ? {marginBottom: "15px", paddingRight: "8px"} : {marginBottom: "14px", paddingRight: "20px"}} onClick={() => navigate("messages")} className={`${location.pathname.split("/")[4] === "messages" ? "j-room-comments-active" : ""} cm-cursor-pointer cm-flex-center`}>
                                    <Badge size="small" count={message?.notificationStats?.badgeCount} offset={[0, 0]} className={`${location.pathname.split("/")[4] === "messages" ? "j-room-comments-active" : ""} cm-cursor-pointer cm-flex-center`}>
                                        <MaterialSymbolsRounded font="comment" size="19"/>
                                    </Badge>
                                    Messages
                                </Space>
                        } */}
                        {
                            CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"
                            ?
                                <div className={`${CommonUtil.__getSubdomain(window.location.origin)  === "sfdc-app" ? "cm-float-right" : ""}`}>
                                    <Space style={{marginBottom: "14px"}} size={14}>
                                        <Space className='cm-flex'>
                                            <Avatar.Group className='cm-flex-align-center cm-cursor-pointer' maxCount={3} size={30} maxPopoverPlacement="bottom" maxStyle={{fontSize: "13px"}}>
                                                {
                                                    rData.room.owner ?
                                                        <Tooltip title="Owner" placement='bottom'>
                                                            <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", border: `2px solid ${colorPrimary}` }} className='cm-flex-align-center' src={rData.room.owner.profileUrl ? <img src={rData.room.owner.profileUrl} alt={CommonUtil.__getFullName(rData.room.owner.firstName, rData.room.owner.lastName)}/> : ""}  onClick={() => setShowManageUsers(true)}>
                                                                {CommonUtil.__getAvatarName(rData.room.owner.firstName, 1)}
                                                            </Avatar>
                                                        </Tooltip>
                                                    :   
                                                    null
                                                }
                                                {
                                                    rData.room.users.filter((_filterUser: any) => !_filterUser.isOwner).map((_user: any) => (
                                                        <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px"}} src={_user.profileUrl ? <img src={_user.profileUrl} alt={CommonUtil.__getFullName(_user.firstName, _user.lastName)}/> : ""} onClick={() => setShowManageUsers(true)}>
                                                            {CommonUtil.__getAvatarName(_user.firstName, 1)}
                                                        </Avatar>
                                                    ))
                                                }
                                            </Avatar.Group>
                                        </Space>          
                                        <Dropdown menu={{items: inviteOptions}}  trigger={["click"]} placement='bottomRight'>
                                            <Button className='cm-flex-center' type='primary' style={{paddingLeft: "10px", paddingRight: "5px"}}>
                                                <Space>
                                                    <div className='cm-font-size14'>Share</div>
                                                    <MaterialSymbolsRounded font='expand_more' size='18'/>
                                                </Space>
                                            </Button>
                                        </Dropdown>
                                    </Space>
                                </div>
                            :
                                ""
                        }
                        {   
                            CommonUtil.__getSubdomain(window.location.origin) === "hs-app" 
                            ? 
                                <Dropdown menu={{items: stageOptions}} trigger={["click"]} overlayStyle={{minWidth: "fit-content"}}>
                                    <Button className='cm-flex-center' style={{paddingLeft: "10px", paddingRight: "5px", marginBottom: "15px", border: `1px solid ${rData?.room?.currentStage?.properties?.color}` , backgroundColor: `${rData?.room?.currentStage?.properties?.color ?? "#DCDCDC"}26`}}>
                                        <Space style={{color: `${rData?.room?.currentStage?.properties?.color}`}}>
                                            {rData?.room?.currentStage?.label}
                                            <MaterialSymbolsRounded font='expand_more' size='18'/>
                                        </Space>
                                    </Button>
                                </Dropdown>
                            :
                                ""
                        }
                    </Space>
                </div>
            </Space>

            <div className='j-room-listing-body'>
                <Outlet context={{"account": data.simpleAccount, "room": rData.room, "tourRef" : tourStep1Ref}}/>
            </div>
            <ShareRoomModal isOpen={showShare.visibility} onClose={() => setShowShare({visibility: false, inviteType: ""})} inviteType={showShare.inviteType} roomData={rData.room}/>
            <ManageSellerModal isOpen={showManageUsers} onClose={() => setShowManageUsers(false)} sellers={rData.room.users} owner={rData.room.owner} previewLink={rData.room.previewLink} room={rData.room}/>
            <ResourceModal
                isOpen      =   {isModalOpen.isOpen}
                onClose     =   {() => setIsModalOpen({isOpen: false, type: "", key: "", displayname: "", domain: "", imageIcon: ""})}
                type        =   {isModalOpen.type}
                uploadKey   =   {isModalOpen.key}
                displayName =   {isModalOpen.displayname}
                domain      =   {isModalOpen.domain}
                imageIcon   =   {isModalOpen.imageIcon}
            />
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resources: any) => handleSelectResource(resources)}
                initialFilter           =   {[]}
                multipleResource        =   {true}
            />
            <HandoffConfirmation
                isOpen      =   {showConfirmation.visibility}
                onClose     =   {() => setShowConfirmation({visibility: false, option: ""})}
                option      =   {showConfirmation.option}
                room        =   {rData.room}
            />
            <RoomLinkModal
                isOpen  =   {showLinkModal}
                onClose =   {() => setShowLinkModal(false)}
                room    =   {rData.room}
            />
            <CRMMapRoomModal
                isOpen  =   {showSyncModal}
                onClose =   {() => setShowSyncModal(false)}
            />
            <RoomSettingsModal
                roomId          =   {params.roomId!}
                roomSettings    =   {roomSettings}
                isOpen          =   {showSettingsModal}
                onClose         =   {() => setShowSettingsModal(false)}
            />
        </>
    )
}

export default RoomLayout
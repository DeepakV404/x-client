import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Input, List, Select, Space, Tabs, Typography } from 'antd';

import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { PermissionCheckers } from '../../../../config/role-permission';
import { ROOM_INVITE_BUYER } from '../../../../tracker-constants';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { AccountsAgent } from '../../api/accounts-agent';
import { GlobalContext } from '../../../../globals';
import { AppTracker } from '../../../../app-tracker';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import BuyerLinkModal from '../../../rooms/room-buying-committee/buyer-link-modal';
import AddSeller from '../../../rooms/room-invite/add-seller';
import Loading from '../../../../utils/loading';
import LinkListItem from './link-list-item';
import TabPane from 'antd/es/tabs/TabPane';

const { TextArea }  =   Input;
const { useForm }   =   Form;
const { Text }      =   Typography

const ShareRoom = (props: {onClose: () => void, roomData: any}) => {

    const { onClose, roomData }   =   props;

    const { buyerPortalLink } = roomData;
    
    const { $isVendorMode, $isVendorOrg, $user, $dictionary } =   useContext(GlobalContext);
    
    const EditBuyerPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');
    
    const [form]        =   useForm();
    const params        =   useParams();

    // const { token: { colorPrimary } }   =   theme.useToken();

    const [currentView, setCurrentView] =   useState<any>({type: "share", data: null});
    const [copyState, setCopyState]     =   useState(false);
    const [isModalOpen, setIsModalOpen] =   useState(false);
    // const [currentTab, setCurrentTab]   =   useState("invite_buyer");
    const [submitState, setSubmitState] =   useState({
        text    :   "Send Invite",
        loading :   false    
    })

    const inputRef  =   useRef<any>(null)

    useEffect(() => {
        setTimeout(() => {
            if(inputRef.current) {
                inputRef?.current?.focus()
            }
        }, 1)
    }, [])
    
    // const { data, error }  =   useQuery(R_BUYER_PORTAL_LINKS, {
    //     fetchPolicy: "network-only",
    //     variables: {
    //         roomUuid:   params.roomId
    //     }
    // });

    const copyLink = (link: string) => {
        CommonUtil.__copyToClipboard(link)
        setCopyState(true)
        setTimeout(() => {
            setCopyState(false)
        }, 2000)
    }

    const onFinish = (values: any) => {
        setSubmitState({
            text    :   "Sending Invite...",
            loading :   true
        })
        AccountsAgent.inviteBuyers({
            variables: {
                roomUuid    :   params.roomId, 
                emailIds    :   values.emailId, 
                message     :   values.message
            },
            onCompletion: () => {
                setSubmitState({
                    text    :   "Send Invite",
                    loading :   false
                })
                onClose()
                CommonUtil.__showSuccess("Contact invited successfully")
                AppTracker.trackEvent(ROOM_INVITE_BUYER, {"Contact email": values.emailId});
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text    :   "Send Invite",
                    loading :   false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    };

    // let filteredSellers = $sellers.filter((_seller) => {
    //     return (
    //         _seller.status !== "DELETED" &&
    //             !roomData?.users?.some((_user: any) => _user?.uuid === _seller.uuid) &&
    //                 roomData?.owner?.uuid !== _seller.uuid
    //     );
    // });

    return (
        <div className="cm-width100">
            <div className="cm-modal-header cm-flex-align-center" style={{columnGap: "15px"}}>
                {/* <Text ellipsis={{tooltip: `Share ${title ? `"${title}"` : ""} ${$dictionary.rooms.singularTitle}`}} style={{width: "calc(100% - 55px)"}} className='cm-font-size16 cm-font-fam500'>{`Share ${title ? `"${title}"` : ""} ${$dictionary.rooms.singularTitle}`}</Text> */}
                <Text className='cm-font-size16 cm-font-fam500'>Share</Text>
                {/* {
                    currentTab === "invite_buyer" ?
                        (
                            data && data._rBuyerPortalLinks.length > 0 ?
                                <Avatar.Group style={{display: "flex"}} maxCount={5} className='cm-cursor-pointer' >
                                    {
                                        data._rBuyerPortalLinks.map((_stakeHolder: any) => (
                                            <>
                                                <Tooltip title={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)} placement="bottom">
                                                    <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "13px", display: "flex", alignItems: "center"}} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : ""} onClick={() => setCurrentView({type: "buyer", data : data?._rBuyerPortalLinks})}>
                                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                                    </Avatar>
                                                </Tooltip>
                                            </>
                                        ))
                                    }
                                    <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "13px", display: "flex", alignItems: "center"}} onClick={() => setCurrentView({type: "buyer", data : data?._rBuyerPortalLinks})}>
                                        <MaterialSymbolsRounded font='more_horiz'/>
                                    </Avatar>
                                </Avatar.Group>
                            :
                                <div></div>
                        )
                    :
                        (
                            <Avatar.Group style={{display: "flex"}} maxCount={5} className='cm-cursor-pointer' >
                                {
                                    roomData?.owner ?
                                        <Tooltip title="Owner" placement='bottom'>
                                            <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", border: `2px solid ${colorPrimary}` }} className='cm-flex-align-center' src={roomData?.owner.profileUrl ? <img src={roomData?.owner.profileUrl} alt={CommonUtil.__getFullName(roomData?.owner.firstName, roomData?.owner.lastName)}/> : ""}>
                                                {CommonUtil.__getAvatarName(roomData?.owner.firstName, 1)}
                                            </Avatar>
                                        </Tooltip>
                                    :   
                                    null
                                }
                                {
                                    roomData?.users.filter((_filterUser: any) => !_filterUser.isOwner).map((_user: any) => (
                                        <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px"}} src={_user.profileUrl ? <img src={_user.profileUrl} alt={CommonUtil.__getFullName(_user.firstName, _user.lastName)}/> : ""}>
                                            {CommonUtil.__getAvatarName(_user.firstName, 1)}
                                        </Avatar>
                                    ))
                                }
                                <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "13px", display: "flex", alignItems: "center"}} onClick={() => setCurrentView({type: "seller", data : filteredSellers})}>
                                    <MaterialSymbolsRounded font='more_horiz'/>
                                </Avatar> 
                            </Avatar.Group>
                        )
                } */}
            </div>
            <div className='j-copy-link-wrap'>
                {
                    currentView.type === "share" 
                    ?
                        <Tabs style={{paddingInline: "15px"}} className='j-buyer-invite-modal'>
                            <TabPane tab={`Invite ${$dictionary.buyers.singularTitle}`} key='invite_buyer'>
                                <Form form={form} className="cm-form cm-modal-content" layout='vertical' onFinish={onFinish} style={{padding: "10px 0 20px 0"}}>
                                    <Space direction='vertical' className='cm-width100 cm-space-inherit'>
                                        <Form.Item name={"emailId"}  rules={[{required: true, message: "Add emails to invite"}]}>
                                            <Select ref={inputRef} className='cm-width100' placeholder="Eg: sample@workemail.com" mode='tags' tokenSeparators={[",", " "]} dropdownStyle={{display: "none"}} suffixIcon={null}></Select>
                                        </Form.Item>
                                        <Form.Item name="message" initialValue={""} noStyle>
                                            <TextArea placeholder='Add a message' rows={6}/>
                                        </Form.Item>
                                    </Space>
                                </Form>
                                <Space className="cm-flex-space-between cm-modal-footer" style={{padding: 0}}>
                                    {/* {
                                        data && data._rBuyerPortalLinks.length > 0 ?
                                            <Avatar.Group style={{display: "flex"}} maxCount={5} className='cm-cursor-pointer' >
                                                {
                                                    data._rBuyerPortalLinks.map((_stakeHolder: any) => (
                                                        <>
                                                            <Tooltip title={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)} placement="bottom">
                                                                <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "13px", display: "flex", alignItems: "center"}} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : ""} onClick={() => setCurrentView({type: "buyer", data : data?._rBuyerPortalLinks})}>
                                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                                                </Avatar>
                                                            </Tooltip>
                                                        </>
                                                    ))
                                                }
                                                <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "13px", display: "flex", alignItems: "center"}} onClick={() => setCurrentView({type: "buyer", data : data?._rBuyerPortalLinks})}>
                                                    <MaterialSymbolsRounded font='more_horiz'/>
                                                </Avatar>
                                            </Avatar.Group>
                                        :
                                            <div></div>
                                    } */}
                                    <div>
                                        {
                                            EditBuyerPermission && (
                                                (CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" || CommonUtil.__getSubdomain(window.location.origin) === "hs-app")
                                            ? 
                                                <Button type='primary' ghost onClick={() => setIsModalOpen(true)} style={{background: "#E5F0FC", border: "1px solid #0065E5", color: "#0065E5"}}>{copyState ? "Copied" : ($isVendorMode || $isVendorOrg ? "Copy Link" : "Copy Room Link")}</Button>
                                            : 
                                                <Button style={{paddingInline: "0px"}} type="link" onClick={() => copyLink(buyerPortalLink ?? "")} ><Space size={4}><MaterialSymbolsRounded font='link' weight='200'/>{copyState ? "Copied" : ($isVendorMode || $isVendorOrg ? "Copy Link" : "Copy Room Link")}</Space></Button>
                                            )
                                        }
                                    </div>
                                    <Space>
                                        <Form.Item noStyle>
                                            <Button className="cm-cancel-btn cm-font-size14 cm-secondary-text" onClick={() => onClose()}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                        <Form.Item noStyle>
                                            <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                                                <Space size={10}>
                                                    <div className="cm-font-size14">{submitState.text}</div>
                                                    {
                                                        submitState.loading && <Loading color="#fff"/>
                                                    }
                                                </Space>
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </Space>
                            </TabPane>
                            <TabPane  tab={"Add Team Member"} key='add_team_member'>
                                <AddSeller {...props} setCurrentView={setCurrentView}/>
                            </TabPane>
                        </Tabs>
                    :
                        <div className='cm-padding15'>
                            <Space>
                                <div style={{background: "#f2f2f2", borderRadius: "20px", padding: "1px"}} className="cm-cursor-pointer" onClick={() => setCurrentView({type: "share", data: null})}>
                                    <MaterialSymbolsRounded font="arrow_back"  color="#454545" size='18' />
                                </div>
                                <div className='cm-font-fam500 cm-fontsize18'>{`Manage ${currentView.type === "buyer" ? "Contacts" : "Teammates"}`}</div>
                            </Space>
                            <div className='j-share-room-link-wrap'>
                                <List
                                    className   =   'cm-margin-top20'
                                    itemLayout  =   "horizontal"
                                    dataSource  =   {currentView.data ?? []}
                                    renderItem  =   {(_stakeHolder: any) => (
                                        <List.Item key={_stakeHolder.uuid}>
                                            <LinkListItem _stakeHolder={_stakeHolder} />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                }
            </div>
            <BuyerLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} buyer={buyerPortalLink} />
        </div>
    )
}

export default ShareRoom
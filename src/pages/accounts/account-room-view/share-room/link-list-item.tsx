import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { Avatar, Badge, Button, Dropdown, MenuProps, Popconfirm, Space, Tooltip, Typography, message } from 'antd';

import { PermissionCheckers } from '../../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { AccountsAgent } from '../../api/accounts-agent';
import { GlobalContext } from '../../../../globals';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import BuyerLinkModal from '../../../rooms/room-buying-committee/buyer-link-modal';

const { Text }  =   Typography;

const LinkListItem = (props: {_stakeHolder: any}) => {
    
    const { $user } =   useContext(GlobalContext);
    
    const EditBuyerPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');
    
    const { _stakeHolder }  =   props;

    const params    =   useParams();

    const [copied, setCopied]           =   useState(false);
    const [isModalOpen, setIsModalOpen] =   useState(false);

    const handleCopyLink = (link: any) => {

        window.navigator.clipboard.writeText(link)
        setCopied(true);

        setTimeout(function() {			
            setCopied(false)
        }, 2000);  
    }

    const getCopyText = (status: string) => {
        if(status === "ACTIVE"){
            return "Copy Link"
        }else{
            return "Copy Invite"
        }
    }

    const items: MenuProps['items'] = [
        {
            key     : 'resend',
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font='forward' size='18'/>
                    {_stakeHolder.status === "ACTIVE" ? "Resend Link" : "Resend Invite"}
                </Space>
            ),
            onClick :   () => {
                const loader = message.loading("Sending link...", 0)
                AccountsAgent.sendRoomLink({
                    variables: {
                        roomUuid: params.roomId, 
                        contactUuid: _stakeHolder.uuid
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
        },
        {
            key     :   'revoke',
            danger  :   true,
            label   :   (
                <Popconfirm 
                    placement           =   "bottom"  
                    title               =   {<div className="cm-font-fam500">Revoke Contacts</div>}
                    description         =   {<div className="cm-font-size13">Are you sure you want to revoke this buyer?</div>}
                    icon                =   {null}
                    okText              =   "Revoke"
                    okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F", fontSize: "12px"}}}
                    cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC", fontSize: "12px"}, ghost: true}}
                    onConfirm           =   {() => {
                        AccountsAgent.revokeAccess({
                            variables: {
                                roomUuid: params.roomId, 
                                contactUuid: _stakeHolder.uuid
                            },
                            onCompletion: () => {
                                CommonUtil.__showSuccess("Access revoked")
                            },
                            errorCallBack: (error: any) => {
                                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                            }
                        })
                    }}
                >
                    <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                        <MaterialSymbolsRounded font='cancel' size='18'/>
                        Revoke
                    </Space>
                </Popconfirm>   
            ),
        }
    ];

    const getStatus = (status: string) => {
        if(status === "ACTIVE"){
            return  <div className='cm-flex-center' style={{columnGap: "8px"}}><Badge status="success" /><span className='cm-display-block cm-font-size12'>Active</span></div>
        }else if(status === "IN_ACTIVE"){
            return <div className='cm-flex-center' style={{columnGap: "8px"}}><Badge status="warning" /><span className='cm-display-block cm-font-size12'>Inactive</span></div>
        }else if(status === "INVITED"){
            return <div className='cm-flex-center' style={{columnGap: "8px"}}><Badge status="processing" /><span className='cm-display-block cm-font-size12'>Invited</span></div>
        }
    }

    return (
        <>
            <Space className='cm-flex-space-between cm-width100'>
                <Space>
                    <Tooltip title={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)} placement="bottom">
                        <Avatar shape='square' size={40} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "14px", display: "flex", alignItems: "center"}} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : ""}>
                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                        </Avatar>
                    </Tooltip>
                    <Space direction='vertical' size={0}>
                        <Text className='cm-font-fam500' ellipsis={{tooltip: CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}} style={{maxWidth: "250px"}}>{CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}</Text>
                        <div className='cm-font-size12'>{_stakeHolder.emailId}</div>
                    </Space>
                </Space>
                <div className='cm-flex-center' style={{columnGap: "20px"}}>
                    {getStatus(_stakeHolder.status)}
                    {
                        _stakeHolder.status !== "IN_ACTIVE" 
                        ? 
                            (
                                <>
                                    {
                                        EditBuyerPermission && (
                                        (CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" || CommonUtil.__getSubdomain(window.location.origin) === "hs-app")
                                        ? 
                                            <Button type='primary' size='small' onClick={() => setIsModalOpen(true)} style={{width: "100px"}}>
                                                <div className='cm-flex-center' style={{columnGap: "5px"}}>
                                                    <MaterialSymbolsRounded className='cm-display-block' font={copied ? 'done' : 'content_copy'} size='14'/>
                                                    <div className='cm-font-size12'>{copied ? "Copied" : getCopyText(_stakeHolder.status)}</div>
                                                </div>
                                            </Button>
                                        : 
                                            <Button type='primary' size='small' onClick={() => handleCopyLink(_stakeHolder.inviteLink)} style={{width: "100px"}}>
                                                <div className='cm-flex-center' style={{columnGap: "5px"}}>
                                                    <MaterialSymbolsRounded className='cm-display-block' font={copied ? 'done' : 'content_copy'} size='14'/>
                                                    <div className='cm-font-size12'>{copied ? "Copied" : getCopyText(_stakeHolder.status)}</div>
                                                </div>
                                            </Button>
                                        )
                                    }
                                    <Dropdown menu={{items}} trigger={["click"]}>
                                        <MaterialSymbolsRounded font='more_vert' size='20' className='cm-cursor-pointer'/>
                                    </Dropdown>
                                </>
                            ) 
                        :
                            <></>
                    }
                </div>
            </Space>
            <BuyerLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} buyer={_stakeHolder.link} />
        </>

    )
}

export default LinkListItem
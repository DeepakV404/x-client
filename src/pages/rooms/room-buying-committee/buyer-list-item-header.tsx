import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Avatar, Button, Badge, Dropdown, message, Select } from "antd";
import { useQuery } from "@apollo/client";

import { CRM_INTEGRATION_CONFIG } from "../../settings/config/integration-type-config";
import { FEATURE_ROOMS } from "../../../config/role-permission-config";
import { PermissionCheckers } from "../../../config/role-permission";
import { AccountsAgent } from "../../accounts/api/accounts-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { RoomsAgent } from "../api/rooms-agent";
import { USER_ROLES } from "../api/rooms-query";
import { GlobalContext } from "../../../globals";

import DeleteConfirmation from "../../../components/confirmation/delete-confirmation";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import UpdateBuyerProfileModal from "./update-buyer-profile-modal";
import BuyerLinkModal from "./buyer-link-modal";
import Loading from "../../../utils/loading";

const { Option } = Select;

const ListItemHeader = (props: { buyer: any, onUpdateBuyer: (updatedBuyer: any) => void , roomData: any}) => {

    const { buyer, onUpdateBuyer, roomData } = props;

    const { $user, $orgDetail }     =     useContext(GlobalContext);

    const [copied, setCopied]               =   useState(false);
    const [isModalOpen, setIsModalOpen]     =   useState(false);
    const [editModal, setEditModal]         =   useState(false);
    
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState({
        visibility: false,
    })

    const EditBuyerPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const { data, loading, error } = useQuery(USER_ROLES, {
        fetchPolicy: 'network-only'
    });

    const params    =   useParams();

    const handleCopyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopied(true);

        setTimeout(function() {			
            setCopied(false)
        }, 2000);  
    }

    const getStatus = (status: string) => {
        if(status === "ACTIVE"){
            return  <Space><Badge status="success"/><div className='cm-font-size12 cm-letter-spacing03'>Active</div></Space>
        }else if(status === "IN_ACTIVE"){
            return <Space><Badge status="warning"/><div className='cm-font-size12 cm-letter-spacing03'>Inactive</div></Space>
        }else if(status === "INVITED"){
            return <Space><Badge status="processing"/><div className='cm-font-size12 cm-letter-spacing03'>Invited</div></Space>
        }
    }

    const getCopyText = (status: string) => {
        if(status === "ACTIVE"){
            return "Copy Link"
        }else{
            return "Copy Invite"
        }
    }

    const items: any['items'] = [
        buyer.status !== "IN_ACTIVE" && {
            key     : 'edit',
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font='edit' size='18'/>
                    Edit
                </Space>
            ),
            onClick :   () => {
                setEditModal(true)
            },
        },
        {
            key     : 'resend',
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font='forward' size='18'/>
                    {buyer.status === "ACTIVE" ? "Resend Link" : "Resend Invite"}
                </Space>
            ),
            onClick :   () => {
                const loader = message.loading("Sending link...", 0)
                AccountsAgent.sendRoomLink({
                    variables: {
                        roomUuid: params.roomId, 
                        contactUuid: buyer.uuid
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
        buyer.status !== "IN_ACTIVE" && roomData?.crmInfo && {
            type: 'divider'
        },
        buyer.status !== "IN_ACTIVE" && roomData?.crmInfo && {
            key     : 'pushToCRM',
            label   : (
                <Space style={{minWidth: "150px"}} className={`cm-flex ${!buyer?.crmSynced ? `cm-cursor-pointer` : `cm-cursor-disabled cm-light-text`} cm-flex-space-between`}>
                    <Space className="cm-flex">
                        <div className="cm-flex-align-center">{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <img width={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} height={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.['logo-icon-size']} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/> : null}</div>
                        Push to CRM
                    </Space>
                </Space>
            ),
            onClick :   () => {
                if(!buyer?.crmSynced){
                    const pushLoading = message.loading("Pushing Buyer to CRM", 0)
                    RoomsAgent.addContactToCRM({
                        variables: {
                            roomUuid: params.roomId, 
                            contactUuid: buyer.uuid
                        },
                        onCompletion: () => {
                            pushLoading()
                            CommonUtil.__showSuccess("Buyer pushed to CRM successfully!")
                        },
                        errorCallBack: (error: any) => {
                            pushLoading()
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }      
                    })
                }
            },
        },
        buyer.status !== "IN_ACTIVE" && {
            type: 'divider'
        },
        buyer.status !== "IN_ACTIVE" && {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
            label   :   (
                <span>{buyer.status === "INVITED" ? "Remove" : "Revoke Access"}</span>
            ),
            onClick :   (_room: any) => {
                setShowDeleteConfirmation({visibility: true})
            },
            danger  :   true
        },
    ].filter(Boolean) // This will remove any `false` entries
    

    const handleAddUserRole = (role: any) => {
        RoomsAgent.addUserRole({
            variables: {
                roomUuid: params.roomId,
                contactUuid: buyer.uuid,
                userRole: role,
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Role updated successfully");
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleRevokeAccess = (status: string) => {
        const loader = message.loading(status === "INVITED" ? "Removing buyer" : "Revoking access", 0)
        AccountsAgent.revokeAccess({
            variables: {
                roomUuid: params.roomId,
                contactUuid: buyer.uuid
            },
            onCompletion: () => {
                setShowDeleteConfirmation({ visibility: false })
                loader()
                CommonUtil.__showSuccess(status === "INVITED" ? "Removed buyer" : "Access revoked")
            },
            errorCallBack: (error: any) => {
                loader()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    if (loading) return <Loading />
    if (error) return <SomethingWentWrong />

    return (
        <>
            <Space className='cm-flex-space-between cm-width100'>
                <Space>
                    {
                        buyer.profileUrl
                            ?
                                <img height={50} width={50} style={{ objectFit: "scale-down", borderRadius: "4px" }} src={buyer.profileUrl} alt="" />
                            :
                            <Avatar shape='square' size={50} style={{ backgroundColor: "#ededed", color: "#000", fontSize: "16px", display: "flex", alignItems: "center" }} >
                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName(buyer.firstName, buyer.lastName), 2)}
                            </Avatar>
                    }
                    <Space size={20}>
                        <Space direction='vertical' size={5}>
                            <div className='cm-font-fam500'>{CommonUtil.__getFullName(buyer.firstName, buyer.lastName)}</div>
                            <div className='cm-font-size12'>{buyer?.emailId}</div>
                        </Space>
                    </Space>
                </Space>
                <Space size={20}>
                    {getStatus(buyer?.status)}
                    {
                        buyer.status !== "IN_ACTIVE" && (
                            <>
                                <Select
                                    key           =   {buyer.uuid}
                                    placeholder   =   {<div className='cm-font-size13'>Select role</div>}
                                    style         =   {{ width: "160px" }}
                                    size          =   'small'
                                    onChange      =   {handleAddUserRole}
                                    suffixIcon    =   {<MaterialSymbolsRounded font='expand_more' size='18'/>}
                                    defaultValue  =   {buyer?.role?.uuid}
                                    disabled      =   {!EditBuyerPermission}
                                >
                                    {
                                        data && data.userRoles.map((_roles: any) => (
                                            <Option key={_roles.uuid} value={_roles.uuid}>
                                                <div className="cm-font-size13">{_roles.name}</div>
                                            </Option>
                                        ))
                                    }
                                </Select>
                                {
                                    EditBuyerPermission && (
                                        (CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" || CommonUtil.__getSubdomain(window.location.origin) === "hs-app")
                                        ? (
                                            <Button size='small' className='cm-flex-center' onClick={() => setIsModalOpen(true)}>
                                                <Space size={4}>
                                                    <MaterialSymbolsRounded font="content_copy" size='14'/>
                                                    <div style={{lineHeight: "normal"}} className='cm-font-size12'>{copied ? "Copied" : getCopyText(buyer?.status)}</div>
                                                </Space>
                                            </Button>
                                        ) : (
                                            <Button size='small' className='cm-flex-center' onClick={() => handleCopyLink(buyer.link)} style={{width: "100px"}}>
                                                <Space size={4}>
                                                    <MaterialSymbolsRounded font={copied ? 'done' : 'content_copy'} size='14'/>
                                                    <div style={{lineHeight: "normal"}} className='cm-font-size12'>{copied ? "Copied" : getCopyText(buyer?.status)}</div>
                                                </Space>
                                            </Button>
                                        )
                                    )
                                }
                            </>
                        )
                    }
                    {
                        EditBuyerPermission &&
                            <Dropdown menu={{items}} trigger={["click"]} >    
                                <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer">
                                    <MaterialSymbolsRounded font="more_vert" size="18"/>
                                </div>
                            </Dropdown>
                    }
                </Space>
            </Space>
            <UpdateBuyerProfileModal
                isOpen          =   {editModal}
                onClose         =   {() => setEditModal(false)}
                buyer           =   {buyer}
                onUpdateBuyer   =   {onUpdateBuyer}
            />
            <BuyerLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} buyer={buyer.link} />
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => handleRevokeAccess(buyer.status)}
                onCancel    =   {() => setShowDeleteConfirmation({ visibility: false })}
                header      =   {buyer.status === "INVITED" ? "Remove Permanently" : 'Revoke Access'}
                body        =   {`Are you sure you want to ${buyer.status === "INVITED" ? "remove" : "revoke"} this buyer ?`}
                okText      =   {buyer.status === "INVITED" ? "Remove" : 'Revoke'}
            />
        </>
    )
}

export default ListItemHeader;

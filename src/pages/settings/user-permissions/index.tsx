import _ from 'lodash';
import { useContext, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Space, Table, Tag, Badge, Button, message, Typography, Avatar, Dropdown, Modal, Form, Input, Select, Row, Col, Tooltip } from "antd";

import { SETTINGS_TEAMS_AND_PERMISSIONS } from '../../../config/role-permission-config';
import { PermissionCheckers } from '../../../config/role-permission';
import { ROLE_ADMIN, ROLE_CONTENT_EDITOR, ROLE_MANAGER, ROLE_PERMISSION, ROLE_USER, ROLE_VIEWER } from '../../../config/role-config';
import { Length_Input } from '../../../constants/module-constants';
import { ADMIN, OWNER, SETTING_CONFIG } from "../config/settings-config";
import { DELETED_USERS, GET_USER_INVITATION_LINK, REGIONS, USERS } from "../api/settings-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { GlobalContext } from "../../../globals";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import DeleteConfirmation from "../../../components/confirmation/delete-confirmation";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded"
import PricingModal from "../pricing/pricing-modal";
import UserRoleModal from "../user-role-modal";
import Loading from "../../../utils/loading";
import UserModal from "./user-modal";
import NewPricingModal from '../pricing/new-pricing-modal';
import UpgradeIcon from '../../../components/upgrade-icon';

const { Text } = Typography;
const { useForm } = Form;

const UserPermissions = () => {

    const { $user, $orgDetail, $isVendorMode, $isVendorOrg, $featData } = useContext(GlobalContext);

    const [form] = useForm();
    
    const [showPurchase, setShowPurchase]   =   useState(false);
    const [showDeletedUsers, setShowDeletedUsers] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [userRole, setUserRole] = useState()
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState({ visibility: false, id: null })
    const [showPricing, setShowPricing] = useState(false);
    const [editUserModal, setEditUserModal] = useState<any>({
        isOpen: false,
        userData: []
    });
    const [userRoleModal, setUserRoleModal] = useState<any>({
        visibility: false,
        user: null,
    });
    const [showModal, setShowModal] = useState({
        visible: false,
        showEdit: false
    });
    const [submitState, setSubmitState] = useState({
        text: "Save",
        loading: false
    })

    let purchasedUser   =   $orgDetail.planDetail.purchasedUsers;
    let remainingUser   =   $orgDetail.planDetail.remainingUsers;
    let currentUserId   =   $user.uuid;

    const handleDelete = (userId: string | null) => {
        SettingsAgent.deleteUser({
            variables: {
                userUuid    :   userId
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Team Member deleted successfully");
                setShowDeleteConfirmation({visibility: false, id: null})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })   
    }

    const { data, loading, error }  =   useQuery(USERS, {
        fetchPolicy: "network-only"
    });

    const [_getUserInvitationLink ] = useLazyQuery(GET_USER_INVITATION_LINK, {
        fetchPolicy: "network-only"
    });

    const { data: regionsData } = useQuery(REGIONS, {
        fetchPolicy: "network-only"
    });

    const regions = regionsData?.regions?.map((region: any) => ({
        value: region.uuid,
        label: region.name,
    }));

    const [_getDeletedUsers, { data: sData, loading: sLoading, error: sError }] = useLazyQuery(DELETED_USERS, {
        fetchPolicy: "network-only"
    });

    const checkRoleOrgType = (role: string) => {
        if($isVendorMode || $isVendorOrg){
            if(ROLE_PERMISSION[role].orgTypes.includes("DPR")){
                return true
            }
            else return false
        }else if(ROLE_PERMISSION[role].orgTypes.includes("DSR")){
            return true
        }
        return false
    }

    const userRoles = Object.values(ROLE_PERMISSION).filter((_role) => {
        return editUserModal.userData.role === "OWNER" || _role.role !== "OWNER" && checkRoleOrgType(_role.role);
    }).map((_role: any) => {
        const isDisabled = remainingUser === 0 && ([ROLE_USER, ROLE_MANAGER, ROLE_ADMIN].includes(_role.role) && [ROLE_CONTENT_EDITOR, ROLE_VIEWER].includes(editUserModal?.userData?.role));
        return{
            value: _role.role,
            label: (
                <div className={`${_role.role === userRoleModal?.user?.role || isDisabled ? "cm-cursor-disabled" : "cm-cursor-pointer"} cm-flex-space-between`}>
                    <Tooltip title={isDisabled ? "You have reached the maximum limit of users" : ""}>
                        <Space direction="vertical" size={0} className='cm-width100'>
                            <Text className={`${isDisabled ? "cm-font-opacity-black-65" : "cm-font-opacity-black-85"} cm-width100`}>{_role.displayName}</Text>
                            <Text className={`${isDisabled ? "cm-font-opacity-black-65" : "cm-font-opacity-black-85"} cm-font-size12 cm-flex-align-center`}>{_role.permissionsDesc}</Text>
                        </Space>
                        {_role.role === userRoleModal?.user?.role && (
                            <MaterialSymbolsRounded font="done" color="#52c41a" />
                        )}
                    </Tooltip>
                </div>
            ),
            displayName: <Text className="cm-font-opacity-black-85 cm-width100">{_role.displayName}</Text>,
            disabled : isDisabled
        }

    });


    // if(loading || sLoading) return <Loading/>
    if(error || sError) return <SomethingWentWrong/>

    const hasUpdatePermission = PermissionCheckers.__checkPermission($user.role, SETTINGS_TEAMS_AND_PERMISSIONS, "update")

    const getStatus = (status: string) => {
        if(status === "ACTIVE"){
            return  <Space><Badge status="success"/><div className='cm-font-size12 cm-letter-spacing03'>Active</div></Space>
        }else if(status === "IN_ACTIVE"){
            return <Space><Badge status="warning"/><div className='cm-font-size12 cm-letter-spacing03'>Inactive</div></Space>
        }else if(status === "INVITED"){
            return <Space><Badge status="processing"/><div className='cm-font-size12 cm-letter-spacing03'>Invited</div></Space>
        }else if(status === "DELETED"){
            return <Space><Badge status="error"/><div className='cm-font-size12 cm-letter-spacing03'>Deleted</div></Space>
        }
    }

    const handleInviteAgain = (_deletedUser: any) => {
        const loading = message.loading("Resending invite", 0);
        SettingsAgent.reinviteUser({
            variables: {
                userUuid: _deletedUser.uuid
            },
            onCompletion: () => {
                loading()
                setShowDeletedUsers(false)
                CommonUtil.__showSuccess("User invited successfully!")
            },
            errorCallBack: () => {
                loading()
            }
        })
    }

    const handleCopyUserLink = (userId: any) => {
        _getUserInvitationLink({ 
            variables: { userUuid: userId },
            onCompleted: (data) => {
                if (data?.getUserInvitationLink) {
                    CommonUtil.__copyToClipboard(data.getUserInvitationLink);
                    CommonUtil.__showSuccess("Link copied to your clipboard!")
                }
            }
        });
    }

    const renderers = {
        "_name"  :   (_record: any) => {  
            return (
                    <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                        <div style={{width: "30px", height: "30px"}}>
                            <Avatar size={30} shape='square' style = {{backgroundColor: "#ededed", color: "#000", borderRadius: "6px" }} src={_record.profileUrl ? <img src={_record.profileUrl} alt={CommonUtil.__getFullName(_record.firstName, _record.lastName)}/> : ""}>
                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_record.firstName, _record.lastName),1)}
                            </Avatar>
                        </div>
                        <Text ellipsis={{ tooltip: CommonUtil.__getFullName(_record.firstName, _record.lastName)}} className="cm-font-fam500" style={{maxWidth: "100%"}}>{CommonUtil.__getFullName(_record.firstName, _record.lastName)} {currentUserId === _record.uuid && <span className="cm-secondary-text cm-font-size13">{"(You)"}</span>}</Text>
                    </div>    
            )
        },
        "_emailId" : (emailId: any) => {
            return (
                <Text ellipsis={{tooltip: emailId}} style={{width: "100%"}}>{emailId}</Text>
            )
        },
        "_role" : (role: string, _record: any) => {
            return(
                <Space className={`cm-width100 cm-flex-space-between ${hasUpdatePermission && _record.status !== "DELETED" && _record.role !== OWNER && _record.uuid !== $user.uuid ? "cm-cursor-pointer" : ""} cm-flex-align-center`}>
                    <Tag color={SETTING_CONFIG[role].color}>{SETTING_CONFIG[role].displayName}</Tag>
                    {hasUpdatePermission && _record.status !== "DELETED" && _record.role !== OWNER && _record.uuid !== $user.uuid ? <MaterialSymbolsRounded font='expand_more'/> : null}
                </Space>
            )
        },
        "_status" : (status: string) => {
            return(getStatus(status))
        },
        "_regions": (_: any, _record: any) => {
            return (
                <Text ellipsis={{ tooltip: _record.regions?.map((region: any) => region.name).join(", ") || "-" }} style={{ width: "100%" }}>
                    {_record.regions?.map((region: any) => region.name).join(", ") || "-"}
                </Text>
            );
        },
        "_actions" : (_record: any) => {
            if (_record.status === "DELETED" && (remainingUser !== 0 || [ROLE_CONTENT_EDITOR, ROLE_VIEWER].includes(_record.role))) {
                return  <div className="cm-flex-justify-end"><Button className="cm-font-size12" onClick={() => handleInviteAgain(_record)}>Invite Again</Button></div>
            }else if(_record.status === "DELETED" && (remainingUser === 0 && [ROLE_ADMIN, ROLE_MANAGER, ROLE_USER].includes(_record.role))) {
                return (
                    <div className="cm-flex-justify-end">
                        <Tooltip title={"You have reached the maximum limit of users"} placement='left'>
                            <Button disabled className="cm-font-size12" onClick={() => handleInviteAgain(_record)}>Invite Again</Button>
                        </Tooltip>
                    </div>
                ) 
            }else{
                const items: any = [
                    {                           
                        key: 'edit',
                        icon: <MaterialSymbolsRounded font="edit" size='16' />,
                        label: "Edit",
                        onClick: () => {
                            setEditUserModal({
                                isOpen: true,
                                userData: _record,
                            });
                        },
                    },
                    _record.role !== OWNER && 
                    {
                        key     :   'copy_link',
                        icon    :   <MaterialSymbolsRounded font="content_copy" size='16' />,
                        label   :   "Copy Invite",
                        onClick :   () => {
                            handleCopyUserLink(_record.uuid)
                        },
                    },
                    _record.uuid !== $user.uuid && 
                    {
                        key: 'divider',
                        type: 'divider',
                    },
                    _record.uuid !== $user.uuid && 
                    {
                        key     :   'delete',
                        icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
                        onClick :   () => {
                            setShowDeleteConfirmation({visibility: true, id: _record.uuid})
                        },
                        label   :   "Delete",
                        danger  :   true,
                    }
                ].filter(Boolean);

                return(
                    <Space className="cm-flex-space-between">
                        {_record.status === "INVITED" ? <Button className="cm-font-size12" onClick={() => handleResendInvite(_record.uuid)}>Resend Invite</Button> : <div></div>}
                        {
                            !($user.role === ADMIN && _record.role === OWNER) && 
                               <Dropdown menu={{ items }} trigger={["click"]} destroyPopupOnHide  overlayStyle={{ width: "150px" }}>
                                    <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer cm-flex-center">
                                        <MaterialSymbolsRounded font="more_vert" size="20" className='cm-secondary-text' />
                                    </div>
                                </Dropdown>
                        }
                    </Space>
                )
            }
        },
    }

    const columns: any = [
        {
            title       :   'Name',
            key         :   'name',
            render      :   renderers._name,
            width       :   "250px",
            fixed       :   "left"
        },
        {
            title       :   'Email',
            dataIndex   :   'emailId',
            key         :   'emailId',
            render      :   renderers._emailId,
            width       :   "300px"
        },
        {
            title       :   'App Role',
            dataIndex   :   'role',
            key         :   'role',
            render      :   renderers._role,
            width       :   "200px",
            onCell      :   (record: any) => ({
                onClick: hasUpdatePermission && record.status !== "DELETED" && record.role !== OWNER && record.uuid !== $user.uuid ? () => {
                    setUserRoleModal({
                        visibility  :   true,
                        user        :   record
                    })
                } : () => {},
            }),
        },
        {
            title       :   'Status',
            dataIndex   :   'status',
            key         :   'status',
            render      :   renderers._status,
            width       :   "120px",
            sorter      :   (recordA: any, recordB: any) => recordA?.status?.length - recordB?.status?.length,
            showSorterTooltip   : false,
        },
        {
            title       :   'Regions',
            dataIndex   :   'regions',
            key         :   'regions',
            render      :   renderers._regions,
            width       :   "200px"
        },
        PermissionCheckers.__checkPermission($user.role, SETTINGS_TEAMS_AND_PERMISSIONS, "update") ?
            {
                key     :   'icon',
                title   :   '',
                render  :   renderers._actions,
                width   :   "200px"
            }
        :
            null
    ].filter(Boolean);

    const displayDeletedUsers = () => {
        _getDeletedUsers(); 
        setShowDeletedUsers(true);
    };

    let getUserData = (users: any) => {
        if(users) {
            let owner       =   users.filter((user: any) => user.role === "OWNER")
            let me          =   users.filter((_user: any) => _user.uuid === $user.uuid && _user.role !== "OWNER")
            let otherUsers  =   users.filter((_user: any) => _user.uuid !== $user.uuid && _user.role !== "OWNER")
            return owner.concat(me, otherUsers)
        } else return []
    }

    const handleResendInvite = (userId: string) => {
        const loader = message.loading("Sending link...", 0)
        SettingsAgent.resendUserInvite({
            variables: {
                userUuid    :   userId
            },
            onCompletion: () => {
                loader()
                CommonUtil.__showSuccess("Link sent successfully");
            },
            errorCallBack: (error: any) => {
                loader()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const onFinish = (values: any) => {

        setSubmitState({
            text: "Saving...",
            loading: true
        })
        SettingsAgent.updateUser({
            variables: {
                userUuid: editUserModal.userData.uuid,
                input: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    role: values.userRole === "OWNER" ? undefined : values.userRole,
                    regionUuids: values.regions
                }
            },
            onCompletion: () => {
                setEditUserModal({
                    isOpen: false,
                    userData: []
                })
                setSubmitState({
                    text: "Save",
                    loading: false
                })
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setSubmitState({
                    text: "Save",
                    loading: false
                })
            }
        })
    }


    return (
        <>
            <div className="cm-height100">
                <div className="cm-width100 j-setting-header">
                    <Space size={3} className="cm-width100 cm-flex-space-between">
                        <Space>
                            <MaterialSymbolsRounded font="group" size="22" color={showDeletedUsers ? "#DF2222" : "#0065E5"}/>
                            <div className="cm-font-size16 cm-font-fam500">{showDeletedUsers ? "Deleted Users" : "Team Members" }</div>
                            {/* {isTrial && <Tag color="#F1F9FF" className="cm-font-fam500 cm-font-size13 cm-link-text" style={{color: "#0176D3"}}>{_.startCase(_.toLower(currentPlan)) + " Plan"}</Tag>} */}
                        </Space>
                        <Space>
                            <Button onClick={() => showDeletedUsers ? setShowDeletedUsers(false) : displayDeletedUsers()}>{showDeletedUsers ? <Space className="cm-flex">Team & Permission</Space> : "Deleted Users"}</Button>
                            {
                                PermissionCheckers.__checkPermission($user.role, SETTINGS_TEAMS_AND_PERMISSIONS, "create") && !showDeletedUsers ?
                                    <Button type='primary' className="j-setting-footer-btn cm-flex-center" onClick={() => $featData?.users?.availableCount === 0  ? setShowPurchase(true) : setShowModal({visible: true, showEdit: false})}>
                                        Add {$featData?.users?.availableCount === 0 ? <UpgradeIcon/> : null}
                                    </Button>
                                :
                                    null
                            }
                        </Space>
                    </Space>
                </div>
                <div className="cm-padding15" style={{height: remainingUser === 0 ? "calc(100% - 240px)" : "calc(100% - 100px)"}}>
                    <Space className={`j-user-count-alert ${remainingUser === 0 ? "expired" : ""} cm-width100 cm-flex-space-between`}>
                        <Space className='cm-flex'>
                            <MaterialSymbolsRounded font="info" size="20" filled/>
                            {remainingUser}/{purchasedUser} purchased users available for your current plan
                            {/* <div className="cm-cursor-pointer" style={{color: "#0065E5", marginLeft: "15px"}} onClick={() => setShowPurchase(true)}>See plans thats offer more</div> */}
                        </Space>
                    </Space>
                    <Table 
                        bordered
                        pagination      =   {false}
                        dataSource      =   {showDeletedUsers ? sData?.deletedUsers : getUserData(data?.users)}
                        columns         =   {columns}
                        loading         =   {{spinning: loading || sLoading, indicator: <Loading/>}}
                        style           =   {{height: remainingUser === 0 ? "calc(100vh - 370px)" : "calc(100vh - 195px)"}}
                        scroll          =   {{y: window.innerHeight - (remainingUser === 0 ? 430 : 250)}}
                    />
                </div>
                {
                    remainingUser === 0 &&
                        <div className="cm-padding15">
                            <Space direction="vertical" className="j-user-expired-pricing" size={10}>
                                <div className="cm-font-size22 cm-font-fam500">All {purchasedUser} users used</div>
                                <Space direction="vertical" className="cm-flex-center" size={20}>
                                    <div className="cm-font-size13 cm-font-fam500">Upgrade your user liscence to add more users</div>
                                    <Button type="primary" onClick={() => setShowPricing(true)}>View Plans</Button>
                                </Space>
                            </Space>
                        </div>
                }
            </div>
            <UserModal 
                isOpen   =  {showModal.visible}
                onClose  =  {() => {setShowModal({visible: false, showEdit: false}); setShowDeletedUsers(false)}}
                isEdit   =  {showModal.showEdit}
            />
            <PricingModal
                isOpen  =   {showPricing}
                onClose =   {() => setShowPricing(false)}
            />
            <NewPricingModal 
                isOpen  =   {showPurchase}
                onClose =   {() => setShowPurchase(false)}
            />
            <UserRoleModal
                user    =   {userRoleModal.user}
                isOpen  =   {userRoleModal.visibility}
                onClose =   {() => setUserRoleModal({visibility: false, user: null})}
            />
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => handleDelete(showDeleteConfirmation.id)}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false, id: null})}
                header      =   'Delete user'
                body        =   'Are you sure you want to delete the user?'
                okText      =   'Delete'
            />
            <Modal
                centered
                className   =   'cm-bs-custom-modal'
                width       =   {500}
                open        =   {editUserModal.isOpen}
                footer      =   {null}
                onCancel    =   {() => setEditUserModal({
                    isOpen: false,
                    userData: {}
                })}
                destroyOnClose
            >
                <div className="cm-modal-header cm-flex-align-center cm-margin-bottom5">
                    <div className="cm-font-fam500 cm-font-size16">Edit User</div>
                </div>

                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    preserve={false}
                    className="cm-form"
                >
                    <div className='cm-modal-content'>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "required", whitespace: true }]} initialValue={editUserModal?.userData?.firstName}>
                                    <Input autoFocus placeholder="First Name" maxLength={Length_Input} size="large"></Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Last Name" name="lastName" initialValue={editUserModal?.userData?.lastName}>
                                    <Input autoFocus placeholder="Last Name" maxLength={Length_Input} size="large"></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        {
                            hasUpdatePermission &&
                            <>
                                <Form.Item name={"userRole"} label={"User Role"} initialValue={editUserModal.userData.role} rules={[{ required: true, message: "required", whitespace: true }]}>
                                    <Select
                                        placeholder="Select Role"
                                        options={userRoles}
                                        value={userRole}
                                        onChange={(selectedValues) => {
                                            setUserRole(selectedValues);
                                        }}
                                        optionLabelProp="displayName"
                                        size='large'
                                        disabled={(editUserModal.userData.uuid === $user.uuid)}
                                        suffixIcon={<MaterialSymbolsRounded font="expand_more" />}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="regions"
                                    label="Regions"
                                    initialValue={editUserModal.userData.regions?.map((region: any) => region.uuid) || []}
                                >
                                    <Select
                                        placeholder="Select regions"
                                        options={regions}
                                        mode="multiple"
                                        value={selectedRegions}
                                        onChange={(selectedValues) => {
                                            setSelectedRegions(selectedValues);
                                        }}
                                        maxTagCount={3}
                                        suffixIcon={<MaterialSymbolsRounded font="expand_more" />}
                                        allowClear
                                        size="large"
                                    />
                                </Form.Item>
                            </>
                        }
                    </div>
                </Form>
                <Space className="cm-flex-justify-end cm-modal-footer">
                    <Form.Item noStyle>
                        <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" onClick={() => setEditUserModal({ isOpen: false, userData: {} })}>
                            <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                        </Button>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button type="primary" className={`cm-flex-center cm-cancel-btn`} onClick={() => { form.submit() }} loading={submitState.loading} disabled={submitState.loading}>
                            Save
                        </Button>
                    </Form.Item>
                </Space>
            </Modal>
        </>
    );

}

export default UserPermissions;
import { useContext, useState } from 'react';
import { Badge, Dropdown, MenuProps, Space, Tooltip, Typography } from 'antd';
import { LinkedinFilled, TwitterOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import { ERROR_CONFIG } from '../../../config/error-config';
import { GlobalContext } from '../../../globals';
import { CommonUtil } from '../../../utils/common-util';
import { RoomsAgent } from '../api/rooms-agent';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { PermissionCheckers, checkPermission } from '../../../config/role-permission';

import DeleteConfirmation from '../../../components/confirmation/delete-confirmation';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import CompanyAvatar from '../../../components/avatars/company-avatar';
import { ACCOUNT_TYPE_DSR } from '../../../constants/module-constants';

const { Text } = Typography;

const RoomNameColumn = (props: { _account: any, _record: any }) => {

    const navigate = useNavigate();

    const { _account, _record } = props;

    const { $user, $dictionary, $isVendorMode, $isVendorOrg, $orgDetail, $accountType } = useContext(GlobalContext);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState({
        visibility: false,
    })

    const RoomEditPermission = PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const updateRoomLanguage = (language: string) => {
        RoomsAgent.updateRoom({
            variables: {
                roomUuid: _record.uuid,
                input: {
                    language: language
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Room language updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const items: MenuProps['items'] = [
        {
            key     :   'preview',
            icon    :   <MaterialSymbolsRounded font="open_in_new" size="16" />,
            label   :   `Preview ${$dictionary.rooms.singularTitle}`,
            onClick :   () => {
                window.open(_record.previewLink, "_blank")
            },
            disabled:   !_record.previewLink
        },
        {
            key     :   'copyRoomLink',
            icon    :   <MaterialSymbolsRounded font="content_copy" size="16" />,
            label   :   `Copy ${$dictionary.rooms.singularTitle} Link`,
            onClick : () => {
                window.navigator.clipboard.writeText(_record.buyerPortalLink)
                CommonUtil.__showSuccess("Link copied successfully!")
            },
        },
        $orgDetail.tenantName !== "kissflow" && !($accountType === ACCOUNT_TYPE_DSR) ? {
            key     :   "discoverySwitch",
            icon    :   <MaterialSymbolsRounded font="forum" size="16" />,
            label   :   _record.isDiscoveryEnabled ? "Disable Discovery" : "Enable Discovery",
            onClick :   () => {
                RoomsAgent.enableOrDisableDiscovery({
                    variables: {
                        roomUuid: _record.uuid,
                        enable: !_record.isDiscoveryEnabled
                    },
                    onCompletion: () => {
                        CommonUtil.__showSuccess(`Discovery ${_record.isDiscoveryEnabled ? "disabled" : "enabled"} successfully`);
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)

                    }
                })
            },
        }: null,
        {
            key             :   'language',
            className       :   "j-rt-language-submenu",
            icon            :   <MaterialSymbolsRounded font="language" size='16' />,
            label           :   "Language",
            popupClassName  :   "j-template-card-submenu",
            expandIcon      :   <MaterialSymbolsRounded font="chevron_right" size="16" />,
            children        :   [
                {
                    key     :   'en',
                    label   :   <div className='cm-font-fam400'>en - English</div>,
                    onClick :   () => {
                        updateRoomLanguage("en")
                    },
                },
                {
                    key     :   'fr',
                    label   :   <div className='cm-font-fam400'>fr - French</div>,
                    onClick :   () => {
                        updateRoomLanguage("fr")
                    },
                },
                {
                    key     :   'de',
                    label   :   <div className='cm-font-fam400'>de - German</div>,
                    onClick :   () => {
                        updateRoomLanguage("de")
                    },
                },
                {
                    key     :   'es',
                    label   :   <div className='cm-font-fam400'>es - Spanish</div>,
                    onClick : () => {
                        updateRoomLanguage("es")
                    },
                },
            ],
        },
    ];

    const handleDeleteRoom = () => {
        RoomsAgent.deleteRoom({
            variables: {
                roomUuid: _record.uuid
            },
            onCompletion: () => {
                setShowDeleteConfirmation({ visibility: false })
                CommonUtil.__showSuccess("Room deleted successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    if (checkPermission($user.role, FEATURE_ROOMS, 'delete')) {
        items.push({
            key: 'divider',
            type: 'divider'
            
        })
        items.push({
            key: 'delete',
            icon: <MaterialSymbolsRounded font="delete" size="16" />,
            label: (
                <span>Delete {$dictionary.rooms.singularTitle}</span>
            ),
            onClick: (_room: any) => {
                setShowDeleteConfirmation({ visibility: true })
            },
            danger: true
        })
    }

    return (
        <>
            <div className='cm-flex hover-item'>
                <div style={{ maxWidth: "calc(100% - 20px)", columnGap: "10px" }} className='cm-width100 cm-flex'>
                    <div style={{ width: "45px" }} onClick={(event) => { event.stopPropagation(); navigate(`/accounts/${_account.uuid}`) }}>
                        <CompanyAvatar company={_account} size={42} />
                    </div>
                    <div style={{ maxWidth: "calc(100% - 60px)", display: 'flex', flexDirection: "column", rowGap: "0px" }}>
                        <div className=' cm-flex-space-between-center'>
                            <Text style={{ maxWidth: "100%" }} ellipsis={{ tooltip: _record.title }} className={`cm-font-fam500 ${($isVendorMode || $isVendorOrg) ? "cm-font-size13 cm-font-opacity-black-65" : ""}`}>
                                {($isVendorMode || $isVendorOrg) ? (_record?.buyers && _record.buyers[0]?.emailId ? _record?.buyers[0]?.emailId : "-") : _record.title}
                            </Text>
                        </div>
                        <Space>
                            <Text style={{ maxWidth: "155px" }} ellipsis={{ tooltip: _account.companyName }} className={($isVendorMode || $isVendorOrg) ? 'cm-font-fam500' : 'cm-font-size13 cm-dark-grey-text'} onClick={(event) => { event.stopPropagation(); navigate(`/accounts/${_account.uuid}`) }}>{_account.companyName}</Text>
                            {
                                _account.websiteUrl ?
                                    <MaterialSymbolsRounded className='cm-cursor-pointer cm-dark-grey-text' font='link' size='16' onClick={(event) => { event.stopPropagation(); window.open(_account.websiteUrl, "_blank") }} />
                                :
                                    null
                            }
                            {
                                _account.linkedInUrl ?
                                    <LinkedinFilled style={{ display: 'block' }} className='cm-cursor-pointer cm-dark-grey-text' size={13} onClick={(event) => { event.stopPropagation(); window.open(_account.linkedInUrl, "_blank") }} />
                                :
                                    null
                            }
                            {
                                _account.twitterUrl 
                                ?
                                    <TwitterOutlined style={{ display: 'block' }} className='cm-cursor-pointer cm-dark-grey-text' size={13} onClick={(event) => { event.stopPropagation(); window.open(_account.twitterUrl, "_blank") }} />
                                :
                                    null
                            }
                            {
                                _record.isProtected 
                                ?
                                    <Tooltip title={"Protected"} mouseEnterDelay={1}>
                                        <div>
                                            <MaterialSymbolsRounded font="lock" size='16' color="#0065E5" />
                                        </div>
                                    </Tooltip>
                                :
                                    null
                            }
                            {_record.badgeCount > 0 && (
                                <Space onClick={(event) => { event.stopPropagation(); navigate(`/rooms/${_account.uuid}/${_record.uuid}/messages`) }}>
                                    <Badge size="small" dot className="cm-flex-center">
                                        <MessageOutlined className='cm-cursor-pointer cm-dark-grey-text' size={13} />
                                    </Badge>
                                    {_record.badgeCount}
                                </Space>
                            )}
                        </Space>
                    </div>
                </div>
                {
                    RoomEditPermission &&
                    <div className='cm-flex-align-center' onClick={(event: any) => event.stopPropagation()}>
                        <Dropdown menu={{ items, selectedKeys: [_record.language] }} trigger={["click"]} className='show-on-hover-icon' >
                            <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer">
                                <MaterialSymbolsRounded font="more_vert" size="22" className='cm-secondary-text' />
                            </div>
                        </Dropdown>
                    </div>
                }
            </div>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => { handleDeleteRoom() }}
                onCancel    =   {() => setShowDeleteConfirmation({ visibility: false })}
                header      =   {`Delete ${$dictionary.rooms.singularTitle}`}
                body        =   {`Are you sure you want to delete the ${$dictionary.rooms.singularTitle}?`}
                okText      =   'Delete'
            />
        </>
    )
}

export default RoomNameColumn
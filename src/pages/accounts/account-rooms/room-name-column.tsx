import { useContext, useState } from 'react';
import { Dropdown, MenuProps, Typography } from 'antd';

import { GlobalContext } from '../../../globals';
import { PermissionCheckers } from '../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { ERROR_CONFIG } from '../../../config/error-config';
import { RoomsAgent } from '../../rooms/api/rooms-agent';
import { CommonUtil } from '../../../utils/common-util';

import DeleteConfirmation from '../../../components/confirmation/delete-confirmation';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { Text }  =   Typography;

const RoomNameColumn = (props: {_record: any}) => {

    const { _record }    =   props;

    const { $user, $isVendorMode, $isVendorOrg }      =   useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [showDeleteConfirmation, setShowDeleteConfirmation]    =   useState({
        visibility  :   false,
    })
    
    const items: MenuProps['items'] = [
        {
            key     :   'preview',
            icon    :   <MaterialSymbolsRounded font="open_in_new" size="16"/>,
            label   :   (
                <span>Preview room</span>
            ),
            onClick :   () => {
                window.open(_record.previewLink, "_blank")
            },
            disabled: !_record.previewLink
        },
        {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
            label   :   (
                <span>Delete room</span>
            ),
            onClick :   (_room: any) => {
                setShowDeleteConfirmation({visibility: true})
            },
            danger  :   true
        },
    ];

    const handleDeleteRoom = () => {
        RoomsAgent.deleteRoom({
            variables: {
                roomUuid: _record.uuid
            },
            onCompletion: () => {
                setShowDeleteConfirmation({visibility: false})
                CommonUtil.__showSuccess("Room deleted successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <>
            <div className='cm-flex hover-item cm-width100 cm-flex-space-between-center'>
                <div style={{ maxWidth: "calc(100% - 60px)", display: 'flex', flexDirection: "column", rowGap: "0px" }}>
                    <div className=' cm-flex-space-between-center'>
                        <Text style={{ maxWidth: "100%" }} ellipsis={{ tooltip: _record.title }} className={`cm-font-fam500 ${($isVendorMode || $isVendorOrg) ? "cm-font-size13 cm-font-opacity-black-65" : ""}`}>
                            {($isVendorMode || $isVendorOrg) ? (_record?.buyers && _record.buyers[0]?.emailId ? _record?.buyers[0]?.emailId : "-") : _record.title}
                        </Text>
                    </div>
                </div>
                {
                    RoomEditPermission &&
                        <div className='cm-flex-align-center' onClick={(event: any) => event.stopPropagation()}>
                            <Dropdown menu={{items}} trigger={["click"]} className='show-on-hover-icon' >    
                                <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer">
                                    <MaterialSymbolsRounded font="more_vert" size="22" className='cm-secondary-text'/>
                                </div>
                            </Dropdown>
                        </div>
                }
            </div>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => {handleDeleteRoom()}}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false})}
                header      =   'Delete room'
                body        =   'Are you sure you want to delete the room?'
                okText      =   'Delete'
            />
        </>
    )
}

export default RoomNameColumn
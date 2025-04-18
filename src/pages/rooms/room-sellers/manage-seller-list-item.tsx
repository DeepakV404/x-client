import { Avatar, Badge, Dropdown, MenuProps, Space, Tooltip, message, Typography } from 'antd';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { RoomsAgent } from '../api/rooms-agent';
import { useParams } from 'react-router';
import { checkPermission } from '../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { useContext } from 'react';
import { GlobalContext } from '../../../globals';
import UpgradeIcon from '../../../components/upgrade-icon';

const ManageSellerListItem = (props: {seller: any, onMarkAsOwner: any}) => {

    const params        =   useParams();
    const {Text}        =   Typography;

    const { seller, onMarkAsOwner }    =   props;

    const { $user, $featData }     =    useContext(GlobalContext);

    const getStatus = (status: string) => {
        if(status === "ACTIVE"){
            return  <Space><Badge status="success" /><div className='cm-font-size12'>Active</div></Space>
        }else if(status === "IN_ACTIVE"){
            return <Space><Badge status="warning" /><div className='cm-font-size12'>Inactive</div></Space>
        }else if(status === "INVITED"){
            return <Space><Badge status="processing" /><div className='cm-font-size12'>Invited</div></Space>
        }
    }

    const items: MenuProps['items'] = [
        {
            key     : 'markAsOwner',
            label   : (
                <Space style={{minWidth: "130px"}} className='cm-flex cm-dark-text' size={5}>
                    <MaterialSymbolsRounded font='admin_panel_settings' size='18'/>
                    Mark as owner {$featData?.sales_handoff?.isRestricted && <div className='cm-padding-left5'><UpgradeIcon/></div>}
                </Space>
            ),
            disabled : Boolean($featData?.sales_handoff?.isRestricted),
            onClick :   () => {
                onMarkAsOwner()
            }
        },
        {
            key     :   'remove',
            danger  :   true,
            label   :   (
                <Space style={{minWidth: "130px"}} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font='cancel' size='18'/>
                    Remove
                </Space>
            ),
            onClick :   () => {
                const loader = message.loading("Removing user from room", 0)
                RoomsAgent.removeRoomUser({
                    variables: {
                        roomUuid    :   params.roomId, 
                        userUuids   :   [seller.uuid]
                    },
                    onCompletion: () => {
                        loader()
                        CommonUtil.__showSuccess("User removed successfully")
                    },
                    errorCallBack: (error: any) => {
                        loader()
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    } 
                })
            }
        }
    ];

    return (
        <Space className='cm-flex-space-between cm-width100'>
            <Space>
                <Tooltip title={CommonUtil.__getFullName(seller.firstName, seller.lastName)} placement="bottom">
                    <Avatar shape='square' size={40} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "14px", display: "flex", alignItems: "center", border: seller.isOwner ? "2px solid #fe8529" : ""}} src={seller.profileUrl ? <img src={seller.profileUrl} alt={CommonUtil.__getFullName(seller.firstName, seller.lastName)}/> : ""}>
                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(seller.firstName, seller.lastName), 1)}
                    </Avatar>
                </Tooltip>
                <Space direction='vertical' size={0}>
                <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: CommonUtil.__getFullName(seller.firstName, seller.lastName)}} className='cm-font-fam500'>{CommonUtil.__getFullName(seller.firstName, seller.lastName)}</Text>
                    <div className='cm-font-size12'>{seller.emailId}</div>
                </Space>
            </Space>
            <Space>
                <Space size={20}>
                    {getStatus(seller.status)}
                </Space>
                {
                    checkPermission($user.role, FEATURE_ROOMS, 'update') &&
                        !seller.isOwner ?
                            <Dropdown menu={{items : items}} trigger={["click"]}>
                                <MaterialSymbolsRounded font='more_vert' size='20' className='cm-cursor-pointer'/>
                            </Dropdown>
                        :
                            <div></div>
                }
            </Space>
        </Space>
    )
}

export default ManageSellerListItem
import { useContext, useState } from 'react';
import { Dropdown, MenuProps, Space, Typography } from 'antd';
import { LinkedinFilled, TwitterOutlined } from '@ant-design/icons';

import { FEATURE_ACCOUNTS } from '../../../config/role-permission-config';
import { checkPermission } from '../../../config/role-permission';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { AccountsAgent } from '../api/accounts-agent';
import { GlobalContext } from '../../../globals';

import DeleteConfirmation from '../../../components/confirmation/delete-confirmation';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import CompanyAvatar from '../../../components/avatars/company-avatar';


const { Text }  =   Typography;

const AccountsNameColumn = (props: { _account: any, _record: any }) => {

    const { _account, _record }  =   props;

    const { $user }    =    useContext(GlobalContext);

    const [showDeleteConfirmation, setShowDeleteConfirmation]    =   useState({
        visibility  :   false,
    })
    
    const items: MenuProps['items'] = [
        {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
            label   :   (
                <span>Delete account</span>
            ),
            onClick :   (_room: any) => {
                setShowDeleteConfirmation({visibility: true})
            },
            danger  :   true
        },
    ];

    const handleDeleteAccount = () => {
        AccountsAgent.deleteAccount({
            variables: {
                accountUuid: _record.uuid
            },
            onCompletion: () => {
                setShowDeleteConfirmation({visibility: false})
                CommonUtil.__showSuccess("Account deleted successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }


    return (
        <>
            <div className='cm-flex hover-item'>
                <div style={{columnGap: "15px"}} className='cm-width100 cm-flex'>
                    <div style={{width: "45px"}}>
                        <CompanyAvatar company={_account} size={42}/>
                    </div>
                    <div style={{width: "calc(100% - 50px)", display: 'flex',flexDirection: "column", rowGap: "3px"}}>
                        <div className='cm-width100 cm-flex-space-between-center'>
                            <Text style={{maxWidth: "200px"}} ellipsis={{tooltip: _record.companyName}} className='cm-font-fam500 cm-font-size14'>
                                {_record.companyName}
                            </Text>
                        </div>
                        <Space size={10}>
                            {
                                _account.websiteUrl ?
                                    <MaterialSymbolsRounded className='cm-cursor-pointer' font='link' size='16' onClick={(event) => {event.stopPropagation(); window.open(_account.websiteUrl, "_blank")}}/>
                                :
                                    null
                            }
                            {
                                _account.linkedInUrl ?
                                    <LinkedinFilled className='cm-cursor-pointer' size={13} onClick={(event) => {event.stopPropagation(); window.open(_account.linkedInUrl, "_blank")}}/>
                            :
                                    null
                            }
                            {
                                _account.twitterUrl ?
                                    <TwitterOutlined className="cm-flex-center" size={13} onClick={(event) => {event.stopPropagation(); window.open(_account.twitterUrl, "_blank")}}/>
                                :
                                    null
                            }
                        </Space>
                    </div>
                </div>
                {
                    checkPermission($user.role, FEATURE_ACCOUNTS, 'delete') &&
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
                onOk        =   {() => {handleDeleteAccount()}}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false})}
                header      =   'Delete account'
                body        =   'Are you sure you want to delete the account?'
                okText      =   'Delete'
            />
        </>
    )
}

export default AccountsNameColumn
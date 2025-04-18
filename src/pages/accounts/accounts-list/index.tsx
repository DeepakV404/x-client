import { useCallback, useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Input, Space } from 'antd';
import { debounce } from 'lodash';

import { GlobalContext } from '../../../globals';
import { GET_TOTAL_ACCOUNTS } from '../api/accounts-query';
import { checkPermission } from '../../../config/role-permission';
import { FEATURE_ACCOUNTS } from '../../../config/role-permission-config';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import AccountModal from '../account-form/account-modal';
import AccountsTable from './accounts-table';
import LockedButton from '../../settings/pricing/locked-button';

const AccountsListing = () => {

    const { $user, $limits, $entityCount } =   useContext(GlobalContext);

    const [showCreate, setShowCreate]       =   useState(false);
    const [searchKey, setSearchKey]         =   useState("");  

    const debouncedSubmit = useCallback(
        debounce((e) => {
            setSearchKey(e.target.value);
        }, 300),[]
    );

    const { data: accountsCount }  =   useQuery(GET_TOTAL_ACCOUNTS, {
        fetchPolicy: "network-only",
        variables: {
            "filter":{
                searchKey: searchKey
            },
        }
    })

    const checkAccountsLimit = () => {
        if($limits && $limits.accountLimit && parseInt($limits.accountLimit) !== -1){
            if($entityCount.accountsCount >= parseInt($limits.accountLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    return (
        <>
            <Space className='cm-flex-space-between j-module-listing-header cm-flex-align-center'>
                <div className='cm-font-fam500 cm-font-size16'>Accounts {accountsCount && accountsCount.getTotalAccounts > 0 && <span className="cm-dark-grey-text cm-font-size14">({accountsCount?.getTotalAccounts})</span>}</div>
                <Space>
                <div className='cm-flex-justify-end'>
                    <Input placeholder="Search" prefix={<MaterialSymbolsRounded font="search" size="18" color="#c1c1c1"/>} allowClear style={{width: "230px"}} onChange={debouncedSubmit}/>
                </div>
                {
                    checkAccountsLimit() ?
                        checkPermission($user.role, FEATURE_ACCOUNTS, 'create') && 
                            <Button className='cm-flex-center cm-icon-button' type="primary" onClick={() => setShowCreate(true)} icon={<MaterialSymbolsRounded font="add" size="20" weight='400'/>}>
                                <div className="cm-font-size14">Create Account</div>
                            </Button>
                    :
                        <LockedButton btnText={`Create Account`}/>
                }
                </Space>
            </Space>
            <AccountsTable searchKey={searchKey} setShowCreate={setShowCreate} accountsLength = {accountsCount?.getTotalAccounts}/>
            <AccountModal isOpen={showCreate} onClose={() => setShowCreate(false)}/>
        </>
    )
}

export default AccountsListing
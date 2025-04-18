import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Avatar, Button, Pagination, Space, Table, Tag ,Typography} from 'antd';

import { GlobalContext } from '../../../globals';
import { CommonUtil } from '../../../utils/common-util';
import { checkPermission } from '../../../config/role-permission';
import { ACCOUNTS, GET_TOTAL_ACCOUNTS } from '../api/accounts-query';
import { FEATURE_ACCOUNTS } from '../../../config/role-permission-config';
import { ACCOUNTS_PAGINATION_COUNT, EMPTY_CONTENT_ACCOUNT_IMG } from '../../../constants/module-constants';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import UserQuickView from '../../../buyer-view/components/user-quick-view';
import LatestActivity from '../../rooms/rooms-listing/latest-activity';
import AccountsNameColumn from './accounts-name-column';
import Loading from '../../../utils/loading';
import LockedButton from '../../settings/pricing/locked-button';

const { Text }      =   Typography;

const Accounts = (props: {searchKey: string, setShowCreate: Dispatch<SetStateAction<boolean>>, accountsLength: number}) => {

    const { searchKey, setShowCreate, accountsLength }          =   props;

    const navigate                                              =   useNavigate();

    const { $user, $dictionary, $limits, $entityCount }      =   useContext(GlobalContext);
    
    const [accountsList, setAccountsList]                       =   useState([])
    const [pageNumber, setPageNumber]                           =   useState(1);

    const [_getAccounts, { data, loading } ]                    =   useLazyQuery(ACCOUNTS, {
        fetchPolicy: "network-only"
    })

    const [_getAccountsCount, { data: searchAccountsCount }]    =   useLazyQuery(GET_TOTAL_ACCOUNTS, {
        fetchPolicy: "network-only",
        variables: {
            "filter":{
                searchKey: searchKey
            },
        }
    });

    useEffect(() => {
        _getAccountsCount({
            variables: {
                "filter":{
                    searchKey: searchKey
                },
            }
        })
    }, [searchKey])

    useEffect(() => {
        _getAccounts({
            variables: {
                "filter":{
                    searchKey: searchKey
                },
                "pageConstraint": {
                    "page"  :   pageNumber,
                    "limit" :   ACCOUNTS_PAGINATION_COUNT
                }
            }
        })
    }, [searchKey, pageNumber])

    useEffect(() => {
        setAccountsList(data?.accounts)
    }, [data])

    const renderers = {
        "_name"  :   (_name: string, _record: any) => {
            return (
                <AccountsNameColumn _account={_record} _record={_record}/>
            )
        },
        "_industryType": (_industryType: any) => {
            return (
                _industryType ? (<Tag color='blue' style={{maxWidth: "100%"}}>
                   <Text className="cm-font-size12" style={{color:"#0958d9"}} ellipsis={{tooltip: _industryType}}>
                    {_industryType}</Text>
                    </Tag>) : (<div className='cm-light-text'>-</div>)
            )
        },
        "_createdAt" :   (_createdAt: any) => {
            return (
                <div className='cm-font-size13 cm-dark-grey-text'>{CommonUtil.__getDateDay(new Date(_createdAt))} {new Date(_createdAt).getFullYear()}, {CommonUtil.__format_AM_PM(_createdAt)}</div>
            )
        },
        "_region": (_: any, _record: any) => {
            return (
                <Text ellipsis={{ tooltip: _record?.region?.name}} style={{ width: "100%" }}>
                    {_record?.region ? _record.region.name : "-"}
                </Text>
            );
        },
        "_stakeHolders": (_stakeHolders: any) => {
            let filteredStakeholders    =   _stakeHolders.filter((_stakeHolder: any) => _stakeHolder.status !== "IN_ACTIVE");
            if(filteredStakeholders.length > 0){
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Avatar.Group maxCount={4} maxPopoverPlacement='bottom'>
                            {
                                filteredStakeholders.map((_stakeHolder: any) => (
                                    <UserQuickView user={_stakeHolder}>
                                        <Avatar
                                            size={30}
                                            style={{ backgroundColor: "#ededed", color: "#000", fontSize: "12px" }}
                                            src={_stakeHolder.profileUrl ?
                                                <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)} /> :""}
                                        >
                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                        </Avatar>
                                    </UserQuickView>
                                ))
                            }
                        </Avatar.Group>
                    </div>
                )
            }else{
                return "-"
            }
        },
        "lastActivity" : (latestActivity: any) => {
            return (
                <div>
                    {
                        latestActivity
                        ?
                            <LatestActivity activity={latestActivity}/>
                        :
                            <span className="cm-font-size11 cm-light-text">No activities found</span>
                    }
                </div>
            )
        },
        "_roomCount" : (_roomCount: any) => {
            return (
                <div>{_roomCount}</div>
            )
        }
    }

    const columns: any = [
        {
            title       :   <div className='cm-font-fam500'>Company name</div>,
            dataIndex   :   'companyName',
            key         :   'companyName',
            render      :   renderers._name,
            width       :   '300px',
            fixed       :   "left"
        },
        {
            title       :    <div className='cm-font-fam500'>Industry type</div>,
            dataIndex   :   'industryType',
            key         :   'industryType', 
            width       :   '250px',
            render      :   renderers._industryType
        },
        {
            title       :   <div className='cm-font-fam500'>No.of {$dictionary.rooms.title.toLowerCase()}</div>,
            dataIndex   :   'roomCount',
            key         :   'roomCount',
            render      :   renderers._roomCount,
            width       :   '150px',
        },
        {
            title       :   <div className='cm-font-fam500'>Region</div>,
            dataIndex   :   'region',
            key         :   'region',
            render      :   renderers._region,
            width       :   '200px',
        },
        {
            title       :   <div className='cm-font-fam500'>Last activity</div>,
            dataIndex   :   'latestActivity',
            key         :   'lastActivity',
            render      :   renderers.lastActivity,
            width       :   '350px',
        },
        {
            title       :   <div className='cm-font-fam500'>Stakeholders</div>,
            dataIndex   :   'members',
            key         :   'members',
            render      :   renderers._stakeHolders,
            width       :   '200px',
        },
        {
            title       :   <div className='cm-font-fam500'>Created on</div>,
            dataIndex   :   'createdAt',
            key         :   'createdAt',
            render      :   renderers._createdAt,
            width       :   '200px',
        }
    ];

    const handleClick = (e:any, record: any) => {
        if(e.metaKey || e.ctrlKey) {
            window.open(window.location.href + "/" + record.uuid, "_blank")
            return
        }else{
            navigate(`${record.uuid}`);
        }
    }

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
            <div className='j-module-listing-body cm-padding15'>
                <Table 
                    bordered
                    className       =   'cm-height100 j-accounts-table'
                    rowClassName    =   {"cm-cursor-pointer"}
                    scroll          =   {{y: accountsLength > ACCOUNTS_PAGINATION_COUNT  ? (window.innerHeight - 235) : (window.innerHeight - 200)}}
                    columns         =   {columns} 
                    dataSource      =   {accountsList} 
                    pagination      =   {false}
                    locale          =   {{
                        emptyText   :   (
                                            <div className='cm-flex-center' style={{ height: "calc(100vh - 245px)", width: "100%" }}>
                                                {loading || !accountsList 
                                                    ?   <Loading /> 
                                                    :   <div className='cm-flex-center cm-width100'>
                                                            <Space direction='vertical' className='cm-flex-align-center' size={20}>
                                                                <img height={200} width={200} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                                                <Space direction='vertical' className='cm-flex-align-center' size={0}>
                                                                    <Text className='cm-font-size18'>No Accounts found!</Text>
                                                                    <Text className='cm-light-text'>We couldn't find any existing Accounts. Want to create one quickly and easily?</Text>
                                                                </Space>
                                                                {
                                                                    checkAccountsLimit() ?
                                                                        checkPermission($user.role, FEATURE_ACCOUNTS, 'create') && <Button type='primary' className='cm-flex-center cm-icon-button' onClick={() => setShowCreate(true)} icon={<MaterialSymbolsRounded font="add" size='20' weight='400'/>}>Create Account</Button>
                                                                    :
                                                                        <LockedButton btnText={`Create Account`}/>
                                                                }
                                                            </Space>
                                                        </div>
                                                }
                                            </div>
                                        )
                    }}
                    onRow           =   {(record) => ({
                        onClick: (e) => handleClick(e, record)
                    })}
                />
                {
                    accountsLength > ACCOUNTS_PAGINATION_COUNT &&
                        <div className='cm-position-absolute cm-flex-align-center j-room-listing-pagination'>
                            <span>Rows per page: {ACCOUNTS_PAGINATION_COUNT}</span>
                            <Pagination size='small' current={pageNumber} defaultPageSize={ACCOUNTS_PAGINATION_COUNT} onChange={(data: any) => setPageNumber(data)} total={searchAccountsCount?.getTotalAccounts} showSizeChanger={false}/>
                        </div>
                }
            </div>
        </>
    )
}

export default Accounts
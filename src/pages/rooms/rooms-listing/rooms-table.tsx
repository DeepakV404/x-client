import { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Table, Avatar, Space, Typography, Tooltip, Tag, Pagination, Button, Badge} from "antd";

import { GlobalContext } from '../../../globals';
import { CommonUtil } from '../../../utils/common-util';
import { GET_TOTAL_ROOMS, ROOMS } from '../api/rooms-query';
import { checkPermission } from '../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { ACCOUNT_TYPE_DPR, EMPTY_CONTENT_ACCOUNT_IMG, ROOMS_PAGINATION_COUNT } from '../../../constants/module-constants';
import { CRM_INTEGRATION_CONFIG } from '../../settings/config/integration-type-config';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import GetRoomEngagementStatus from '../../../components/get-room-engagement-status';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import UserQuickView from '../../../buyer-view/components/user-quick-view';
import SellerAvatar from '../../../components/avatars/seller-avatar';
import BuyerAvatar from '../../../components/avatars/buyer-avatar';
import RoomNameColumn from './room-name-column';
import LatestActivity from './latest-activity';
import Loading from '../../../utils/loading';
import LockedButton from '../../settings/pricing/locked-button';

const { Text } = Typography

const SORT_CONFIG: any = {
    "title"             :   "ROOM_NAME",
    "latestActivity"    :   "LAST_ACTIVITY_TIME",
    "createdAt"         :   "CREATED_TIME"
}

const ASC_DESC_CONFIG: any = {
    "ascend"    :   "ASC",
    "descend"   :   "DESC"
}

const RoomsTable = (props: { searchKey: string, setShowModal: any, setCreateLeadRoom: any, dataFilter: any, setFilteredAllRoomsCount: any, setFilteredMyRoomsCount: any, roomsCount: number, roomFilter: any}) => {
    
    const { searchKey, setShowModal, setCreateLeadRoom, dataFilter, setFilteredAllRoomsCount, setFilteredMyRoomsCount, roomsCount, roomFilter }       =   props;

    const { $orgDetail, $user, $dictionary, $isVendorOrg, $isVendorMode, $limits, $entityCount, $accountType }    =   useContext(GlobalContext);

    const isCRMConnected                                =   Boolean($orgDetail?.crmDetail);

    const navigate                                      =   useNavigate();

    const [roomsData, setRoomsData]                     =   useState([])
    const [pageNumber, setPageNumber]                   =   useState(1);
    const [sorter, setSorter]                           =   useState({
        columnKey   :   "",
        order       :   ""
    })

    const [_getRooms, {data, loading, error} ]          =   useLazyQuery(ROOMS, {
        fetchPolicy: "network-only"
    })

    const [_getRoomsCount, { data: searchRoomsCount }]  =   useLazyQuery(GET_TOTAL_ROOMS, {
        fetchPolicy: "network-only",
        variables: {
            "filter":{
                myRooms     : dataFilter === "all_rooms" ? false : true,
                searchKey   : searchKey
            },
        }
    });

    useEffect(() => {
        setPageNumber(1)
    }, [dataFilter])

    useEffect(() => {

        let templateId = roomFilter.template ? roomFilter.template : undefined;
        let language   = roomFilter.language ? roomFilter.language : undefined;
        let createdBy  = roomFilter.createdBy ? roomFilter.createdBy : undefined;
        let roomStatus = roomFilter.status ? roomFilter.status : undefined;
        let roomStage  = roomFilter.stage ? roomFilter.stage : undefined;
        let discoveryEnabled = roomFilter.discoveryEnabled === 'enabled' ? true : roomFilter.discoveryEnabled === 'disabled' ? false : undefined;
        let regions = roomFilter.region ? roomFilter.region : undefined;

        _getRooms({
            variables: {
                filter: {
                    templatesUuid     : templateId,
                    myRooms           : dataFilter === "all_rooms" ? false : true,
                    discoveryEnabled  : discoveryEnabled,
                    languages         : language,
                    createdByUuids    : createdBy,
                    roomStatus        : roomStatus,
                    roomStagesUuid    : roomStage,
                    searchKey         : searchKey,
                    regionUuids       : regions,
                    engagementStatus  : roomFilter.engagementStatus,
                },
                "pageConstraint": {
                    "page"  :   pageNumber,
                    "limit" :   ROOMS_PAGINATION_COUNT
                },
                "sortBy": sorter.order ? {
                    field: SORT_CONFIG[sorter.columnKey],
                    type: ASC_DESC_CONFIG[sorter.order]
                } : null
            }
        })

        _getRoomsCount({
            variables: {
                filter: {
                    templatesUuid     : templateId,
                    myRooms           : dataFilter === "all_rooms" ? false : true,
                    discoveryEnabled  : discoveryEnabled,
                    engagementStatus  : roomFilter.engagementStatus,
                    languages         : language,
                    createdByUuids    : createdBy,
                    roomStatus        : roomStatus,
                    roomStagesUuid    : roomStage,
                    searchKey         : searchKey,
                },
            }
        })

    }, [dataFilter, searchKey, pageNumber, sorter, roomFilter])

    useEffect(() => {
        if(searchRoomsCount){
            if(dataFilter === "all_rooms") {
                setFilteredAllRoomsCount(searchRoomsCount?.getTotalRooms)
            } else {
                setFilteredMyRoomsCount(searchRoomsCount?.getTotalRooms)
            }
        }
    }, [searchRoomsCount])

    useEffect(() => {
        setRoomsData(data?.rooms)
    }, [data])

    const renderers = {
        "_name"  :   (_account: any, record: any) => {
            return (
                <RoomNameColumn _account={_account} _record={record}/>
            )
        },
        "_currentStage" : (data:any) => {
            return (
                <Tag
                    style={{
                        border          : 'none',
                        backgroundColor : `${data?.properties?.color ?? "#DCDCDC"}26`,
                        color           : data?.properties?.color
                    }}
                >
                    <Space style={{ color: data?.properties?.color }} className='cm-flex-center'>
                        <Badge color={`${data?.properties?.color ?? "#DCDCDC"}`} />
                        <Text ellipsis={{tooltip: data?.label}} className='cm-font-size13' style={{maxWidth: "140px", color: `${data?.properties?.color ?? "#DCDCDC"}`}}>{data?.label}</Text>
                    </Space>
                </Tag>   
            );
        },
        "lastActivity" : (latestActivity: any) => {
            return (
                <div className='cm-font-size13'>
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
        "_createdAt" :   (_createdAt: any, record: any) => {
            return (
                <Space direction='vertical' size={4}>
                    <div className='cm-font-fam500 cm-whitespace-no-wrap'>
                        {CommonUtil.__getDateDay(new Date(_createdAt))} {new Date(_createdAt).getFullYear()}, {CommonUtil.__format_AM_PM(_createdAt)}
                    </div>
                    <Tooltip title={CommonUtil.__getFullName(record.createdBy.firstName, record.createdBy.lastName)}>
                        <Text className='cm-font-size13 cm-dark-grey-text' style={{ maxWidth: "150px" }} ellipsis>
                            {CommonUtil.__getFullName(record.createdBy.firstName, record.createdBy.lastName)}
                        </Text>
                    </Tooltip>
                </Space>
            )
        },
        "_buyers": (_stakeHolders: any) => {
            if(_stakeHolders.filter((_stakeHolder: any) => _stakeHolder.status !== "IN_ACTIVE").length > 0){
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Avatar.Group maxCount={4} maxPopoverPlacement='bottom'>
                            {
                                _stakeHolders
                                    .filter((_stakeHolder: any) => _stakeHolder.status !== "IN_ACTIVE")
                                    .map((_stakeHolder: any, index: number) => (
                                        <UserQuickView key={index} user={_stakeHolder}>
                                            <div>
                                                <BuyerAvatar buyer={_stakeHolder} size={35} fontSize={12} />
                                            </div>
                                        </UserQuickView>
                                    ))
                            }
                        </Avatar.Group>
                    </div>
                );
            }else{
                return "-"
            }
        },
        "_sellers": (_sellers: any) => {
            if(_sellers.filter((_stakeHolder: any) => _stakeHolder.status !== "IN_ACTIVE").length > 0){
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Avatar.Group maxCount={4} maxPopoverPlacement='bottom'>
                            {
                                _sellers
                                    .filter((_stakeHolder: any) => _stakeHolder.status !== "IN_ACTIVE")
                                    .map((_stakeHolder: any, index: number) => (
                                        <UserQuickView key={index} user={_stakeHolder}>
                                            <SellerAvatar seller={_stakeHolder} size={30} fontSize={12} isOwner={_stakeHolder?.isOwner}/>
                                        </UserQuickView>
                                    ))
                            }
                        </Avatar.Group>
                    </div>
                );
            }else{
                return "-"
            }
        },
        "_stats" : (_record: any) => {
            return (
                <Space direction='vertical' size={4}>
                    <div className='cm-font-size11 cm-dark-grey-text'>Total time spent</div>
                    <div className='cm-font-fam500 cm-font-size13'>{_record.totalTimeSpent ? `${CommonUtil.__getFormatDuration(_record.totalTimeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}` : "-"}</div>
                </Space>
            )
        },
        "_status": (_record: any) => {
            return (
                <GetRoomEngagementStatus roomStatus={_record.engagementStatus} />
            )
        },
         "_region": (_: any, _record: any) => {
            return (
                <Space direction='vertical' size={4}>
                    {_record.region
                        ?
                        <Text className='cm-font-size13 cm-font-fam500' style={{ maxWidth: "150px" }} ellipsis={{ tooltip: _record.region.name }}>
                            {_record.region.name}
                        </Text>
                        :
                        <Text className='cm-font-size13 cm-light-text'>
                            -
                        </Text>
                    }
                </Space>
            )
        },
        "_crmInfo" : (crmInfo: any) => {
            return(
                crmInfo?.type ?
                    <Space size={0} direction='vertical'>
                        <a href={crmInfo.url} target='_blank' className='cm-flex-align-center j-rooms-crm-link hover-item' onClick={(event: React.MouseEvent<HTMLElement>) => event.stopPropagation()}>
                            <Text ellipsis={{tooltip: crmInfo?.name}} style={{maxWidth: "170px"}} className='cm-font-fam500 j-rooms-crm-link-text'>{crmInfo?.name}</Text>
                            <div className='show-on-hover-icon cm-margin-left5 j-rooms-crm-link-text'>
                                <MaterialSymbolsRounded font='open_in_new' size='15'/>
                            </div>
                        </a>
                        <div className='cm-font-size11 cm-light-text' style={{lineHeight: "20px"}}>{crmInfo?.type === "deal" ? CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.deal : CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.contact}</div>
                    </Space>
                :
                    <div>-</div>
            )
        },
        "_template": (_template: any) => {
            if(_template){
                return (
                    !_template?.isDeleted ? 
                        <NavLink style={{color: "#000000E0"}} to={`/templates/${_template.uuid}`} onClick={(event) => event.stopPropagation()}>
                            <Space direction='vertical' size={4}>
                                <Text ellipsis={{tooltip: _template.title}} style={{maxWidth: "180px"}} className='cm-font-size13 cm-link-text'>{_template.title}</Text>
                                {_template.isDeleted ? <Tag color='volcano'>Deleted</Tag> : null}
                            </Space>
                        </NavLink>
                    :
                        <Space direction='vertical' size={4}>
                            <Text ellipsis={{tooltip: _template.title}} style={{maxWidth: "180px"}} className='cm-font-size13'>{_template.title}</Text>
                            {_template.isDeleted ? <Tag color='volcano'>Deleted</Tag> : null}
                        </Space>
                )
            }else{
                return (
                    <div>-</div>
                )
            }
        }
    }

    const columns: any = [
        {
            title       :   ($isVendorMode || $isVendorOrg) ? <div className='cm-font-fam500'>{$dictionary.rooms.singularTitle} Info</div> : <div className='cm-font-fam500'>{$dictionary.rooms.singularTitle} name</div>,
            dataIndex   :   'buyerAccount',
            key         :   'title',
            render      :   renderers._name,
            width       :   '340px',
            fixed       :   "left",
            sorter      :   true
        },
        isCRMConnected ? 
        {
            title       :   <Space className='cm-font-fam500 cm-flex-align-center'>{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <div className='cm-flex' style={{lineHeight: ""}}><img width={35} height={20} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/></div> : null}<div>CRM Info</div></Space>,
            dataIndex   :   'crmInfo',
            key         :   'crmInfo',
            render      :   renderers._crmInfo,
            width       :   '220px',
        } 
        : null,
        {
            title       :   <div className='cm-font-fam500'>{$dictionary.buyingCommittee.title}</div>,
            dataIndex   :   'buyers',
            key         :   'buyers',
            render      :   renderers._buyers,
            width       :   '170px',
        },
        {
            title       :   <div className='cm-font-fam500'>{$dictionary.rooms.singularTitle} Status</div>,
            key         :   "stats",
            render      :   renderers._status,
            width       :   '140px'
        },
        {
            title       :   <div className='cm-font-fam500'>Stats</div>,
            key         :   "stats",
            render      :   renderers._stats,
            width       :   '170px'
        },
        {
            title       :   <div className='cm-font-fam500'>Last Activity</div>,
            dataIndex   :   'latestActivity',
            key         :   'latestActivity',
            render      :   renderers.lastActivity,
            width       :   '350px',
            sorter      :   true
        },
        !($isVendorMode || $isVendorOrg) ?
        {
            title       :   <div className='cm-font-fam500'>Sales team</div>,
            dataIndex   :   'sellers',
            key         :   'sellers',
            render      :   renderers._sellers,
            width       :   '170px',
        } : null,
        !($isVendorMode || $isVendorOrg) ?
        {
            title       :   <div className='cm-font-fam500'>Stage</div>,
            dataIndex   :   'currentStage',
            key         :   'currentStage',
            render      :   renderers._currentStage,
            width       :   '200px',
        } : null,
        {
            title       :   ($isVendorMode || $isVendorOrg) ? <div className='cm-font-fam500'>{$dictionary.rooms.singularTitle} Region</div> : <div className='cm-font-fam500'>Region</div>,
            dataIndex   :   'region',
            key         :   'region',
            render      :   renderers._region,
            width       :   '170px',
        },
        {
            title       :   <div className='cm-font-fam500'>Template</div>,
            dataIndex   :   'template',
            key         :   'template',
            render      :   renderers._template,
            width       :   '220px',
        },
        {
            title       :   <div className='cm-font-fam500'>Created at</div>,
            dataIndex   :   'createdAt',
            key         :   'createdAt',
            render      :   renderers._createdAt,
            width       :   '200px',
            sorter      :   true
        },
    ].filter(Boolean);

    const handleRowClick = (record: any) => {
        record.buyers.length > 0 ? navigate(`${record.buyerAccount.uuid}/${record.uuid}/sections`,) : navigate(`${record.buyerAccount.uuid}/${record.uuid}/sections`)
    }

    const handleRowMetaClick = (record: any) => {
        window.open(`${window.location.origin}/${$orgDetail.tenantName}#/rooms/${record.buyerAccount.uuid}/${record.uuid}/${record.buyers.length > 0 ? "sections" : "sections"}`, "_blank")   
    }

    const onChange = (_: any, __: any, _sorter: any) => {
        setSorter({
            columnKey: _sorter.columnKey,
            order: _sorter.order
        })
    }

    const checkRoomsLimit = () => {
        if($limits && $limits.roomLimit && parseInt($limits.roomLimit) !== -1){
            if($entityCount.roomsCount >= parseInt($limits.roomLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    if(error) return <SomethingWentWrong />

    return (
        <>
            <div className='j-module-listing-body cm-padding15'>          
                <Table
                    bordered
                    className       =   'j-accounts-table cm-position-relative'
                    rowClassName    =   {"cm-cursor-pointer"}
                    scroll          =   {{y: roomsCount > ROOMS_PAGINATION_COUNT ? (window.innerHeight - 235) : (window.innerHeight - 200)}}
                    columns         =   {columns} 
                    dataSource      =   {roomsData}
                    pagination      =   {false}
                    onChange        =   {onChange}
                    locale          =   {{
                        emptyText   :   (
                                            <div className='cm-flex-center' style={{ height: "calc(100vh - 245px)", width: "calc(100vw - 30px)" }}>
                                                {(loading || !roomsData) 
                                                    ? 
                                                        <Loading /> 
                                                    : 
                                                        <div className='cm-flex-center cm-width100'>
                                                            <Space direction='vertical' className='cm-flex-align-center' size={20}>
                                                                <Space direction='vertical' className='cm-flex-align-center' size={0}>
                                                                    <img height={200} width={200} src={EMPTY_CONTENT_ACCOUNT_IMG} alt=""/>
                                                                    <Text className='cm-font-size18'>No {$dictionary.rooms.title} Found</Text>
                                                                    <Text className='cm-light-text '>We couldn't find any existing {$dictionary.rooms.title}. Want to create one quickly and easily?</Text>
                                                                </Space>
                                                                {
                                                                    $accountType === ACCOUNT_TYPE_DPR ?
                                                                        null
                                                                    :
                                                                        checkRoomsLimit() ?
                                                                            checkPermission($user.role, FEATURE_ROOMS, 'create') && 
                                                                                <Button type='primary' className='cm-flex-center cm-icon-button' onClick={() => ($isVendorMode || $isVendorOrg) ? setCreateLeadRoom(true) : setShowModal(true)} icon={<MaterialSymbolsRounded font="add" size='20' weight='400'/>}>Create {$dictionary.rooms.singularTitle}</Button>
                                                                        :
                                                                            <LockedButton btnText={`Create ${$dictionary.rooms.singularTitle}`}/>
                                                                }
                                                            </Space>
                                                        </div>}
                                            </div>
                                        )
                    }}
                    onRow           =   {(record: any) => ({
                        onClick :   (event: any) => {                            
                            if(event.metaKey || event.ctrlKey){
                                handleRowMetaClick(record)
                            }else{
                                handleRowClick(record)
                            }
                        },
                    })}
                />
                {
                    roomsCount > ROOMS_PAGINATION_COUNT &&
                        <div className='cm-position-absolute cm-flex-align-center j-room-listing-pagination'>
                            <span>Rows per page: {ROOMS_PAGINATION_COUNT}</span>
                            <Pagination size='small' current={pageNumber} defaultPageSize={ROOMS_PAGINATION_COUNT} onChange={(data: any) => setPageNumber(data)} total={searchRoomsCount?.getTotalRooms} showSizeChanger={false}/>
                        </div>
                }
            </div>
        </>
    )
}

export default RoomsTable
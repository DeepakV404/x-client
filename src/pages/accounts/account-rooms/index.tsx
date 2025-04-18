import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Avatar, Pagination, Space, Table, Typography } from "antd";

import { ROOMS_PAGINATION_COUNT } from "../../../constants/module-constants";
import { CommonUtil } from "../../../utils/common-util";
import { ROOMS } from "../../rooms/api/rooms-query";
import { ACCOUNT } from "../api/accounts-query";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import UserQuickView from "../../../buyer-view/components/user-quick-view";
import LatestActivity from "../../rooms/rooms-listing/latest-activity";
import CompanyAvatar from "../../../components/avatars/company-avatar";
import BuyerAvatar from "../../../components/avatars/buyer-avatar";
import EmptyText from "../../../components/not-found/empty-text";
import RoomNameColumn from "./room-name-column";
import Loading from "../../../utils/loading";
import { GlobalContext } from "../../../globals";

const { Text } = Typography;

const AccountRooms = () => {

    const params = useParams();
    const navigate = useNavigate();

    const { $dictionary, $isVendorMode, $isVendorOrg }    =  useContext(GlobalContext);

    const [pageNumber, setPageNumber] = useState(1)

    const { data, loading, error } = useQuery(ACCOUNT, {
        variables: {
            accountUuid: params.accountId
        }
    });

    const [_getAccountRooms, { data: accountRooms, loading: roomsLoading, error: accountError }] = useLazyQuery(ROOMS, {
        fetchPolicy: "network-only",
    })

    useEffect(() => {
        _getAccountRooms({
            variables: {
                filter: {
                    accountsUuid: [params.accountId]
                },
                pageConstraint: {
                    page: pageNumber,
                    limit: ROOMS_PAGINATION_COUNT
                }
            }
        })
    }, [pageNumber])

    const handleSelectedPage = (data: number) => {
        setPageNumber(data)
    }

    const renderers = {
        "_name": (_name: string, _record: any) => {
            return (
                <RoomNameColumn _record={_record} />
            )
        },
        "lastActivity": (latestActivity: any) => {
            return (
                <div>
                    {
                        latestActivity
                            ?
                            <LatestActivity activity={latestActivity} />
                            :
                            <span className="cm-font-size11 cm-light-text">No activities found</span>
                    }
                </div>
            )
        },
        "_createdAt": (_createdAt: any) => {
            return (
                <div className='cm-font-size13 cm-dark-grey-text'>{CommonUtil.__getDateDay(new Date(_createdAt))} {new Date(_createdAt).getFullYear()}, {CommonUtil.__format_AM_PM(_createdAt)}</div>
            )
        },
        "_buyers": (_stakeHolders: any) => {
            if (_stakeHolders.length > 0) {
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Avatar.Group maxCount={4} maxPopoverPlacement='bottom'>
                            {
                                _stakeHolders
                                    .filter((_stakeHolder: any) => _stakeHolder.status !== "IN_ACTIVE")
                                    .map((_stakeHolder: any, index: number) => (
                                        <UserQuickView key={index} user={_stakeHolder}>
                                            <div>
                                                <BuyerAvatar buyer={_stakeHolder} size={30} fontSize={12} />
                                            </div>
                                        </UserQuickView>
                                    ))
                            }
                        </Avatar.Group>
                    </div>
                )
            } else {
                return (
                    // TODO
                    // Add invite buyer if no buyers are found
                    <div className="cm-font-size12 cm-empty-text">No buyers found</div>
                )
            }
        },
        "_stats": (_record: any) => {
            return (
                <Space size={20}>
                    <Space direction='vertical' size={4}>
                        <div className='cm-font-size11'>Total Interactions</div>
                        <div className='cm-font-fam500'>{_record.totalInteractions}</div>
                    </Space>
                    <Space direction='vertical' size={4}>
                        <div className='cm-font-size11'>Total time spent</div>
                        <div className='cm-font-fam500'>{_record.totalTimeSpent ? `${CommonUtil.__getFormatDuration(_record.totalTimeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}` : "-"}</div>
                    </Space>
                </Space>
            )
        }
    }

    const columns = [
        {
            title: ($isVendorMode || $isVendorOrg) ? <div className='cm-font-fam500'>{$dictionary.rooms.singularTitle} Info</div> : <div className='cm-font-fam500'>{$dictionary.rooms.singularTitle} name</div>,
            dataIndex: 'title',
            key: 'title',
            render: renderers._name,
            width: '30%',
        },
        {
            title: "Last activity",
            dataIndex: 'latestActivity',
            key: 'lastActivity',
            render: renderers.lastActivity,
            width: '25%',
        },
        {
            title: <div className='cm-font-fam500'>{$dictionary.buyingCommittee.title}</div>,
            dataIndex: 'buyers',
            key: 'buyers',
            render: renderers._buyers,
            width: '20%',
        },
        {
            title: "Stats",
            key: "stats",
            render: renderers._stats,
            width: '25%'
        },
        {
            title: "Created on",
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: renderers._createdAt,
            width: '15%',
        },
    ];

    if (loading) return <Loading />
    if (error || accountError) return <SomethingWentWrong />

    const handleRowClick = (e:any, record: any) => {
        if((e.metaKey || e.ctrlKey)) {
            window.open(`/#/rooms/${data.account.uuid}/${record.uuid}/sections` ,"_blank")
            return
        }
        navigate(`/rooms/${data.account.uuid}/${record.uuid}/sections`)
    }

    let account = data.account;

    const AccountRoomHeader = () => {
        return (
            <Space>
                <CompanyAvatar size={55} company={account} />
                <Space direction="vertical" size={4}>
                    <Text style={{ maxWidth: "500px" }} ellipsis={{ tooltip: data.account.companyName }} className="cm-font-fam600 cm-font-size15">{data.account.companyName} - {$dictionary.rooms.title} <span className="cm-font-fam500">({data.account.rooms.length})</span></Text>
                    <Text style={{ maxWidth: "500px" }} ellipsis={{ tooltip: data.account.companyName }} className="cm-font-size12">All the {$dictionary.rooms.title} associated with this account ({data.account.companyName}) are listed here.</Text>
                </Space>
            </Space>
        )
    }

    return (
        <>
            <Table
                bordered
                className='cm-height100 j-accounts-table cm-padding15 cm-position-relative'
                rowClassName={"cm-cursor-pointer"}
                scroll={{ y: (window.innerHeight - 325) }}
                columns={columns}
                dataSource={accountRooms?.rooms}
                pagination={false}
                locale={{
                    emptyText: <div className='cm-flex-center' style={{ height: "calc(100vh - 320px)" }}>
                        {(roomsLoading || !accountRooms) ? <Loading /> : <EmptyText text='No rooms found' />}
                    </div>
                }}
                onRow={(record: any) => ({
                    onClick: (e) => handleRowClick(e, record)
                })}
                title={() => <AccountRoomHeader />}
            />
            {
                data.account.rooms.length > 20 &&
                <div className='cm-position-absolute j-room-listing-pagination'>
                    <span>Rows per page: {ROOMS_PAGINATION_COUNT}</span>
                    <Pagination size='small' current={pageNumber} defaultPageSize={ROOMS_PAGINATION_COUNT} onChange={(data) => handleSelectedPage(data)} total={data.account.rooms.length} showSizeChanger={false} />
                </div>
            }
        </>
    )
}

export default AccountRooms
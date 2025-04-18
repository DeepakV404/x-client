import { useEffect, useState } from 'react';
import { Divider, Space, Table, Typography } from 'antd';

import { CHROME_ICON, DECK_NOTION_DOC_LINK, EDGE_ICON, NO_DECKS_SHARED, NOT_TRACKED_YET, SAFARI_ICON } from '../../../../constants/module-constants';
import { CommonUtil } from '../../../../utils/common-util';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import PageResourceViewColumnChart from '../resource-view-graph';
import Loading from '../../../../utils/loading';
import DeckVideoAnalytics from '../deck-video-analytics-graph';

const { Text } = Typography

interface BuyerContext {
    deviceType: string;
    browserName: string;
    operatingSystem: string;
    country: string;
    city: string;
    region: string;
}

interface Buyer {
    type: 'BUYER' | 'ANONYMOUS_BUYER';
    emailId: string;
    firstName: string;
    lastName: string | null;
    profileUrl: string | null;
    status: string;
    uuid: string;
    company: string | null;
    buyerContext: BuyerContext;
}

interface Resource {
    title: string;
    type: string;
    uuid: string;
}

interface ResourceView {
    downloadCount: number;
    lastViewedAt: number;
    resource: Resource;
    timeSpent: number;
    views: number;
}

interface DeckView {
    buyer: Buyer;
    lastViewedAt: number;
    timeSpent: number;
    views: number;
    resourceViews: ResourceView[]
}

interface DeckReportProps {
    reportFilter: "CONTACTS" | "UNKNOWN";
    viewersData: { deckViews: DeckView[] };
    viewersLoading: boolean;
}

const DeckReportTable = (props: DeckReportProps) => {

    const { reportFilter, viewersData, viewersLoading } = props;

    const [expandedRowKeys, setExpandedRowKeys]             =   useState<any[]>([]);
    const [selectedResourceCard, setSelectedResourceCard]   =   useState<ResourceView>()  
    const [buyerId, setBuyerId]                             =   useState<string | null>(null)

    const filteredUsers = reportFilter === "CONTACTS" ? viewersData?.deckViews.filter((user: DeckView) => user.buyer.type === "BUYER") : viewersData?.deckViews.filter((user: DeckView) => user.buyer.type === "ANONYMOUS_BUYER")

    useEffect(() => {
        if (filteredUsers?.length) {
            setExpandedRowKeys([filteredUsers[0].buyer.uuid]);
            setSelectedResourceCard(filteredUsers[0].resourceViews[0]);
            setBuyerId(filteredUsers[0].buyer.uuid);
        }
    }, [reportFilter, viewersData]);


    const handleResourceClick = (resource: ResourceView, buyerId: string) => {
        setSelectedResourceCard(resource)
        setBuyerId(buyerId)
    }

    const reportColumRenderers: any = {
        "_contact": (record: DeckView) => {
            return (
                <Space>
                    <div className='cm-flex-center j-link-contact-avatar cm-font-size13'>
                        {CommonUtil.__getAvatarName(record.buyer.firstName, 1)}
                    </div>
                    <Text ellipsis={{ tooltip: record.buyer.emailId }} style={{ maxWidth: "280px" }}>{record.buyer.emailId}</Text>
                </Space>
            )
        },
        "_info": (record: DeckView) => {
            return (
                <Text className='cm-secondary-text' ellipsis={{ tooltip: record.buyer.emailId }} style={{ maxWidth: "280px" }}>
                    {record.buyer?.buyerContext?.city ? `Someone from ${record.buyer?.buyerContext?.city}` : "Anonymous"}
                </Text>
            )
        },
        "_account": (record: DeckView) => {
            return (<Text className='cm-secondary-text'>{record.buyer.company ?? "-"}</Text>)
        },
        "_lastActivity": (record: DeckView) => {
            const date = new Date(record.lastViewedAt);
            return (
                <Text className='cm-secondary-text'>{record.lastViewedAt ? `${CommonUtil.__getDateDay(date)} ${date.getFullYear()}, ${CommonUtil.__format_AM_PM(date)}` : "-"}</Text>
            )
        },
        "_medium": (record: DeckView) => {
            return (
                    <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                        {
                            record?.buyer?.buyerContext ? 
                                <>
                                    {getDevice(record?.buyer?.buyerContext?.deviceType)}
                                    {getBrowser(record?.buyer?.buyerContext?.browserName)}
                                    {
                                        record?.buyer?.buyerContext?.city && record?.buyer?.buyerContext?.country ?
                                            <>
                                                <Divider type='vertical'/>
                                                <div className='cm-flex-align-center' style={{columnGap: "4px"}}>
                                                    <MaterialSymbolsRounded font='location_on' size='18'/>
                                                    <Text>{record?.buyer?.buyerContext?.city}, {record?.buyer?.buyerContext?.country}</Text>
                                                </div>
                                            </>
                                        :
                                            null
                                    }
                                </>
                            :
                                "-"
                        }
                    </div>
            )
        },
        "_activity": (record: DeckView) => {
            return (
                <Space size={16} className='cm-secondary-text'>
                    <Space size={4}><MaterialSymbolsRounded font={"timer"} size='18' /> <Text>{record.timeSpent === 0 ? "0" : `${CommonUtil.__getFormatDuration(record.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`}</Text></Space>
                    <Space size={4}><MaterialSymbolsRounded font={"visibility"} size='18' /> <Text>{record.views}</Text></Space>
                </Space>
            )
        },
        "_actions": (record: any) => {
            return (
                <div className='cm-flex-justify-end'>
                    <MaterialSymbolsRounded font={record.buyer.uuid === expandedRowKeys[0] ? "keyboard_arrow_up" : "stat_minus_1"} className='cm-cursor-pointer' />
                </div>
            )
        },
    }

    const deckReportColumns: any = [
        reportFilter === "CONTACTS" ?
        {
            title: <div className='cm-font-fam500'>Contact Name</div>,
            key: 'contact',
            render: reportColumRenderers._contact,
            width: "300px",
            fixed: "left"
        }
        :
        {
            title: <div className='cm-font-fam500'>Visitor Info</div>,
            key: 'info',
            render: reportColumRenderers._info,
            width: "300px",
            fixed: "left"
        },
        reportFilter === "CONTACTS" ?
        {
            title: <div className='cm-font-fam500'>Account</div>,
            key: 'account',
            render: reportColumRenderers._account,
            width: "175px",
        } : null,
        {
            title: <div className='cm-font-fam500'>Last Activity</div>,
            key: 'lastActivity',
            render: reportColumRenderers._lastActivity,
            width: '175px',
        },
        {
            title: <div className='cm-font-fam500'>Info</div>,
            key: 'medium',
            render: reportColumRenderers._medium,
            width: "250px"
        },
        {
            title: <div className='cm-font-fam500'>Activity</div>,
            key: 'activity',
            render: reportColumRenderers._activity,
            width: "250px"
        },
        {
            key: 'actions',
            fixed: "right",
            render: reportColumRenderers._actions,
            width: "50px",
            onCell: (record: any) => ({
                onClick: () => {
                    setSelectedResourceCard(record.resourceViews[0]);
                    setBuyerId(record.buyer.uuid);
                    handleExpand(record);
                },
            }),
        },
    ].filter(Boolean);

    const handleExpand = (record: any) => {        
        if(expandedRowKeys.includes(record.buyer.uuid)) {
            setExpandedRowKeys([])
        } else {
            setExpandedRowKeys([record.buyer.uuid]);
        }
    };

    const getBrowser = (browser: string) => {        
        switch(browser) {
            case "Safari"   :   return  <img style={{padding: "1.5px"}} src={SAFARI_ICON} height={"19"} width={"19"} alt="Safari"/>
            // case "Firefox"  :   return  <img style={{padding: "1.5px"}} src="https://cdn-icons-png.flaticon.com/128/5968/5968827.png" height={"20"} width={"20"} alt="Firefox" />
            case "Edge"     :   return  <img style={{padding: "1.5px"}} src={EDGE_ICON} height={"19"} width={"19"} alt="Edge" />
            default         :   return  <img style={{padding: "1.5px"}} src={CHROME_ICON} height={"19"} width={"19"} alt="Chrome" />
        }
    }

    const getDevice = (device: string) => {
        switch(device){
            case "Tablet"   :   return <MaterialSymbolsRounded font="tablet" size='20'/>
            case "Mobile"   :   return <MaterialSymbolsRounded font="phone_iphone" size='20'/>
            default         :   return <MaterialSymbolsRounded font="laptop_mac" size='20'/>
        }
    }

    const usersInfoColumns: any = {
        "_usersData": (record: DeckView) => {        
            return (
                <div className='cm-scrollbar-none' style={{ height: "275px", overflow: "auto", display: "block" }}>
                    <Space direction='vertical' className='cm-width100 cm-height100 cm-margin-bottom20' key={record.buyer.uuid}>
                        {
                            record.resourceViews.map((res: ResourceView) => (
                                <Space 
                                    key         =   {res.resource.uuid} 
                                    className   =   {`cm-cursor-pointer j-deck-report-table-resource-card ${selectedResourceCard?.resource.uuid === res.resource.uuid && record.buyer.uuid === buyerId ? "selected" : ""}`} 
                                    onClick     =   {() => handleResourceClick(res, record.buyer.uuid)} 
                                    direction   =   'vertical'
                                >
                                    <Text className={`cm-font-size13 cm-font-fam500 ${selectedResourceCard?.resource.uuid === res.resource.uuid && record.buyer.uuid === buyerId && "cm-active-color"}`} style={{ width: "262px" }} ellipsis={{ tooltip: res.resource.title }}>
                                        {res.resource.title}
                                    </Text>
                                    <div className='cm-flex' style={{columnGap: "15px"}}>
                                        <Space size={3}><MaterialSymbolsRounded font={"timer"} size='18' /> <Text className='cm-font-fam500'>{res.timeSpent === 0 ? "-" : `${CommonUtil.__getFormatDuration(res.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`}</Text></Space>
                                        <Space size={3}><MaterialSymbolsRounded font={"visibility"} size='18' /> <Text className='cm-font-fam500'>{res.views}</Text></Space>
                                    </div>
                                </Space>
                            ))
                        }
                    </Space>
                </div>
            )
        },

        "_resReport": () => {                        
            if (selectedResourceCard?.resource.type === 'DOCUMENT') {
                return <PageResourceViewColumnChart resourceData={selectedResourceCard} buyerId={buyerId} />
            }else{
                return <DeckVideoAnalytics selectedResourceCard={selectedResourceCard}/>
            }
        }
    }

    const expandedRowRender = (record: any) => {
        if(record.resourceViews.length > 0){
            return (
                <Table
                    className="j-deck-table-2 cm-background-white"
                    showHeader={false}
                    pagination={false}
                    columns={[
                        {
                            key: 'users_info',
                            render: usersInfoColumns._usersData,
                            width: "300px",
                            fixed: "left",
                        },
                        {
                            key: 'res_info',
                            render: usersInfoColumns._resReport,
                            className: `${selectedResourceCard?.resource.type !== 'DOCUMENT' && "cm-flex cm-height100"}`
                        }
                    ]}
                    size="small"
                    dataSource={[record]}
                />
            )
        }else{
            return (
                <div className='cm-flex-center cm-text-align-center'>
                    <img src={NOT_TRACKED_YET}/>
                </div>
            )
        }
    };

    return (
        <>
            {
                viewersLoading
                    ?
                        <Loading />
                    :
                        <Table
                            bordered
                            rowKey      =   {(record) => record.buyer.uuid}
                            style       =   {{ borderRadius: "6px", outline: "none", height: "calc(100% - 150px" }}
                            className   =   "j-agent-vs-meeting-row"
                            columns     =   {deckReportColumns}
                            size        =   'small'
                            dataSource  =   {filteredUsers || []}
                            pagination  =   {false}
                            scroll      =   {{ y: "calc(100vh - 335px)" }}
                            onRow       =   {
                                (record) => ({
                                    onClick: () => {
                                        setSelectedResourceCard(record.resourceViews[0]);
                                        setBuyerId(record.buyer.uuid);
                                        handleExpand(record);
                                    },
                                })
                            }
                            expandable  =   {{
                                expandedRowKeys,
                                expandIconColumnIndex: -1,
                                onExpand: (record) => handleExpand(record),
                                expandedRowRender: expandedRowRender,
                            }}
                            locale={{
                                emptyText:
                                    <div className='cm-flex-center' style={{ height: "calc(100vh - 350px)" }}>
                                        <Space direction='vertical' className='cm-flex-center' size={20}>
                                            <img src={NO_DECKS_SHARED} alt='no_links_found' />
                                            <Space direction='vertical' className='cm-flex-center' size={10}>
                                                <div className='cm-font-fam500 cm-font-size16 cm-font-opacity-black-65'>All set! Start sharing the link</div>
                                                <div className='cm-font-opacity-black-65'>People who access this link will be listed here</div>
                                                <span className='cm-font-size12 cm-font-opacity-black-65'><a style={{ textDecoration: 'underline' }} href={DECK_NOTION_DOC_LINK} target='_blank'>Refer</a> this link for tracking</span>
                                            </Space>
                                        </Space>
                                    </div>
                            }}
                        />
            }
        </>
    )
}

export default DeckReportTable
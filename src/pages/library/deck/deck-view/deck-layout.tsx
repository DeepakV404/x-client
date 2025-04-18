import { useQuery } from '@apollo/client';
import { Col, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DECK, DECK_ANALYTICS, DECK_VIEWS } from '../../api/library-query';

import DeleteConfirmation from '../../../../components/delete-confirmation-modal';
import DeckReportTable from './deck-report-table';
import Loading from '../../../../utils/loading';
import DeckResources from './deck-resources';
import DeckHeader from './deck-header';
import { CommonUtil } from '../../../../utils/common-util';

const { Text } = Typography;

interface ResourceView {
    downloadCount: number;
    lastViewedAt: number;
    resource: {
      uuid: string;
      title: string;
      type: string;
    };
    timeSpent: number;
    views: number;
}

interface Buyer {
    buyerContext: {
        deviceType: string;
        browserName: string;
        operatingSystem: string;
        city: string;
        region: string;
    };
    company: string | null;
    emailId: string;
    firstName: string;
    lastName: string;
    profileUrl: string | null;
    status: string;
    type: string;
    uuid: string;
}
  
  interface DeckView {
    buyer: Buyer;
    lastViewedAt: number;
    resourceViews: ResourceView[];
    timeSpent: number;
    views: number;
}

const DeckLayout = () => {

    const params = useParams();

    const { data: deck } = useQuery(DECK, {
        variables: {
            deckUuid: params.linkId
        },
        fetchPolicy: "network-only"
    });

    const { data: viewersData, loading: viewersLoading } = useQuery(DECK_VIEWS, {
        variables: {
            deckUuid: params.linkId
        },
        fetchPolicy: "network-only"
    });
    
    const { data: analyticsData, loading: analyticsLoading } = useQuery(DECK_ANALYTICS, {
        variables: {
            deckUuid: params.linkId
        },
        fetchPolicy: "network-only"
    })

    const [usersList, setUsersList]                     =   useState<"CONTACTS" | "UNKNOWN">("CONTACTS")
    const [deleteConfirmation, setDeleteConfirmation]   =   useState<{isOpen: boolean; data: any}>({
        isOpen: false,
        data: null
    });

    useEffect(() => {
        if(viewersData?.deckViews.length) setUsersList(viewersData?.deckViews.some((user: DeckView) => user.buyer.type === "BUYER") ? "CONTACTS" : "UNKNOWN")
    }, [viewersData])

    const handleDelete = () => {

    }

    return (
        <>
            <div className='cm-height100' style={{ backgroundColor: "#F1F4F7" }}>
                {/* Head */}
                <DeckHeader deck={deck?.deck} />
                {/* Head */}
                {/* Body */}
                <div className='cm-padding15' style={{ height: "calc(100% - 50px)" }}>
                    <Row gutter={15} className='cm-height100'>
                        <Col flex={"auto"} style={{ maxWidth: "calc(100% - 410px)" }}>
                            <div className='cm-background-white cm-border-radius6 cm-margin-bottom15 cm-flex-space-between cm-padding20 j-deck-card-shadow' style={{ height: "90px", paddingInline: "40px" }}>
                                {
                                    analyticsLoading
                                        ?
                                            <div className='cm-margin-auto cm-width100'>
                                                <Loading />
                                            </div>
                                        :
                                            <>
                                                <Space direction='vertical'>
                                                    <Text>Views</Text>
                                                    <Text className='cm-font-fam500 cm-font-size18'>{analyticsData?.deckAnalytics.views ?? 0}</Text>
                                                </Space>
                                                <Space direction='vertical'>
                                                    <Text>Unique Views</Text>
                                                    <Text className='cm-font-fam500 cm-font-size18'>{analyticsData?.deckAnalytics.uniqueViews ?? 0}</Text>
                                                </Space>
                                                <Space direction='vertical'>
                                                    <Text>Time Spent</Text>
                                                    <Text className='cm-font-fam500 cm-font-size18'>{analyticsData?.deckAnalytics.timeSpent ? (CommonUtil.__getFormatDuration(analyticsData?.deckAnalytics.timeSpent).map((_stamp: any) =>`${_stamp.value} ${_stamp.unit}`).join(" ") ?? 0) : 0}</Text>
                                                </Space>
                                                <Space direction='vertical'>
                                                    <Text>Downloads</Text>
                                                    <Text className='cm-font-fam500 cm-font-size18'>{analyticsData?.deckAnalytics.downloadCount ?? 0}</Text>
                                                </Space>
                                                <Space direction='vertical'>
                                                    <Text>Reshares</Text>
                                                    <Text className='cm-font-fam500 cm-font-size18'>{analyticsData?.deckAnalytics.reshareCount ?? 0}</Text>
                                                </Space>
                                            </>
                                }
                            </div>
                            <div className='cm-width100 cm-flex-space-between cm-margin-bottom15'>
                                <Space onClick={(e: any) => setUsersList(e.target.dataset.cta)}>
                                    <div data-cta="CONTACTS" className={`cm-background-white j-deck-card-shadow j-deck-cta cm-flex-center ${usersList === "CONTACTS" && "selected"}`}>Contacts {viewersData?.deckViews.filter((user: any) => user.buyer.type === "BUYER").length}</div>
                                    <div data-cta="UNKNOWN" className={`cm-background-white j-deck-card-shadow j-deck-cta cm-flex-center ${usersList === "UNKNOWN" && "selected"}`}>Anonymous {viewersData?.deckViews.filter((user: any) => user.buyer.type === "ANONYMOUS_BUYER").length}</div>
                                </Space>
                                {/* <Space>
                                    <div className='cm-background-white j-deck-card-shadow j-deck-cta cm-flex-center'>Sort By</div>
                                    <div className='cm-background-white j-deck-card-shadow j-deck-cta cm-flex-center'>Filters</div>
                                    <div className='cm-background-white j-deck-card-shadow j-deck-cta cm-flex-center'>Export</div>
                                </Space> */}
                            </div>
                            <DeckReportTable
                                reportFilter    =   {usersList}
                                viewersData     =   {viewersData}
                                viewersLoading  =   {viewersLoading}
                            />
                        </Col>
                        <Col flex="410px" className='cm-height100'>
                            <div className='cm-background-white cm-height100 cm-border-radius6 j-deck-card-shadow'>
                                <DeckResources deck={deck} />
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* Body */}
            </div>
            <DeleteConfirmation
                isOpen      =   {deleteConfirmation.isOpen}
                content     =   {{
                    module: "Deck Resource",
                    cautionMessage: `Caution! Deleting this resource will remove it from ${deck?.deck.title}.`,
                }}
                onOk        =   {handleDelete}
                onCancel    =   {() => setDeleteConfirmation({isOpen: false, data: null})}
            />
        </>
    )
}

export default DeckLayout
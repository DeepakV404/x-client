import { useQuery } from "@apollo/client";
import { GET_ROOMS_BY_ACCOUNT } from "../api/sfdc-query";
import { CommonUtil } from "../../utils/common-util";
import { Avatar, Badge, Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import UserQuickView from "../../buyer-view/components/user-quick-view";
import GetRoomEngagementStatus from "../../components/get-room-engagement-status";
import { useState } from "react";
import Globals from "../../globals";
import AppLayout from "../../layout";
import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import { NO_ROOMS_SFDC } from "../../constants/module-constants";
import SellerAvatar from "../../components/avatars/seller-avatar";
import Loading from "../../utils/loading";
import LatestActivity from "../../pages/rooms/rooms-listing/latest-activity";

const { Text }  =   Typography

const Account = (props: {libraryURL: string, linksURL: string}) => {

    const { libraryURL, linksURL }  =   props

    const [isRoomClicked, setIsRoomClicked]     =   useState({
        visibility: false,
        roomId: "",
        roomTitle: "",
        accountId: ""
    })

    const { data, loading } =   useQuery(GET_ROOMS_BY_ACCOUNT, {
        variables: {
            accountId   :   CommonUtil.__getQueryParams(window.location.search).id
        }
    })    

    if(loading) return <Loading/>
    
    return (
        isRoomClicked .visibility
            ?
                <Globals>
                    <>
                        <Space className='cm-width100 cm-flex-space-between' style={{height: "25px"}}>
                            <Space size={6}>
                                <MaterialSymbolsRounded className="cm-float-right cm-cursor-pointer" font="arrow_back" size="22" onClick={() => setIsRoomClicked({visibility: false, roomId: "", accountId: "", roomTitle: ""})}/>
                                <Text className="cm-font-fam500">{isRoomClicked.roomTitle}</Text>
                            </Space>
                            <Space>
                                <a href={libraryURL} target='_blank'><Button size='small'><Space className='cm-font-size12'>Library<MaterialSymbolsRounded font='open_in_new' size='16'/></Space></Button></a>
                                <a href={linksURL} target='_blank'><Button size='small' className='cm-font-size12'>Links<MaterialSymbolsRounded font='open_in_new' size='16'/></Button></a>
                            </Space>
                        </Space>
                        <div style={{height: "calc(100% - 25px)"}} className='cm-width100'>
                            <AppLayout  sfdcRoomId={isRoomClicked.roomId} sfdcAccountId={isRoomClicked.accountId}/>
                        </div>
                    </>
                </Globals> 
            : 
                <div style={{height: "100%", width: "100%"}} className="cm-overflow-auto cm-padding10">
                        {
                            (!data?._crmGetRoomsByAccount && !loading)
                                ?
                                    <Space direction="vertical" className="cm-flex-center" style={{height: "calc(100% - 200px)"}}>
                                        <img src={NO_ROOMS_SFDC} alt="" />
                                        <div style={{fontSize: "22px"}}>No Rooms Found</div>
                                        <Text className="cm-font-size12">Create a personalized room for this account directly from the opportunity section</Text>
                                    </Space>
                                :
                                    <Space direction="vertical" className="cm-width100">
                                        <Text className="cm-font-fam500 cm-font-size16">Rooms ({data?._crmGetRoomsByAccount.length})</Text>
                                        {data?._crmGetRoomsByAccount.map((_availableRoom: any) => (
                                            <Card className="cm-margin-bottom10 j-sfdc-room-card j-sfdc-room-list cm-cursor-pointer" onClick={() => setIsRoomClicked({visibility: true, roomId: _availableRoom.uuid, roomTitle: _availableRoom.title, accountId: _availableRoom.buyerAccount.uuid})}>
                                                <Row className="cm-width100">
                                                    <Col span={6} className="j-sfdc-room-col cm-flex-align-center">
                                                        <Space direction="vertical" size={0}>
                                                            <div className="cm-font-fam500">{_availableRoom.title}</div>
                                                            <Space size={2}>
                                                                {
                                                                    _availableRoom.latestActivity ?
                                                                        <div style={{fontSize: "12px", color: "#000000e0"}}><LatestActivity activity={_availableRoom.latestActivity} isDashboard/></div>
                                                                    :
                                                                        <span className="cm-font-size11 cm-light-text">No activities found</span>
                                                                }
                                                            </Space>
                                                        </Space>
                                                    </Col>
                                                    <Col span={4} className="j-sfdc-room-col cm-flex-align-center">
                                                        <Space size={2} direction="vertical">
                                                            <Text className="cm-font-opacity-black-67 cm-font-size12">Opportunity</Text>
                                                            <div className="cm-font-fam500">{_availableRoom.crmInfo.name}</div>
                                                        </Space>
                                                    </Col>
                                                    <Col span={4} className="j-sfdc-room-col cm-flex-align-center">
                                                        <Space direction="vertical">
                                                            <Text className="cm-font-opacity-black-67 cm-font-size12">Status</Text>
                                                            <GetRoomEngagementStatus roomStatus={_availableRoom.engagementStatus}/>
                                                        </Space>
                                                    </Col>
                                                    <Col span={3} className="j-sfdc-room-col cm-flex-align-center">
                                                        <Space direction="vertical">
                                                            <Text className="cm-font-opacity-black-67 cm-font-size12">Stage</Text>
                                                            <Tag
                                                                style={{
                                                                    border          : 'none',
                                                                    backgroundColor : `${_availableRoom.currentStage.properties.color ?? "#DCDCDC"}26`,
                                                                    color           : _availableRoom.currentStage.properties.color
                                                                }}
                                                            >
                                                                <Space style={{ color: _availableRoom.currentStage.properties.color }} className='cm-flex-center'>
                                                                    <Badge color={`${_availableRoom.currentStage.properties.color ?? "#DCDCDC"}`} />
                                                                    <Text ellipsis={{tooltip: _availableRoom.currentStage.label}} className='cm-font-size13' style={{maxWidth: "140px", color: `${_availableRoom.currentStage.properties.color ?? "#DCDCDC"}`}}>{_availableRoom.currentStage.label}</Text>
                                                                </Space>
                                                            </Tag>
                                                        </Space>
                                                    </Col>
                                                    <Col span={4} className="j-sfdc-room-col cm-flex-align-center">
                                                        <Space direction="vertical">
                                                            <div className="cm-font-size12 cm-font-opacity-black-67">Buying Committee</div>
                                                            <Avatar.Group maxCount={4} maxPopoverPlacement='bottom' className="cm-flex-center">
                                                                {
                                                                    (!_availableRoom?.buyers.length)
                                                                        ?   "-" 
                                                                        :   _availableRoom.buyers.map((_stakeHolder: any) => (
                                                                            <UserQuickView user={_stakeHolder} inProduct={false}>
                                                                                <Avatar size={28} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "11px"}} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : ""}>
                                                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                                                                </Avatar>
                                                                            </UserQuickView>
                                                                    ))
                                                                }
                                                            </Avatar.Group>
                                                        </Space>
                                                    </Col>
                                                    <Col span={3} className="j-sfdc-room-col cm-flex-align-center">
                                                        <Space direction="vertical">
                                                            <div className="cm-font-size12 cm-font-opacity-black-67">Sales Team</div>
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <Avatar.Group maxCount={4} maxPopoverPlacement='bottom'>
                                                                    {   
                                                                        (!_availableRoom?.sellers.length)
                                                                        ?   "-" :
                                                                        _availableRoom.sellers
                                                                            .filter((_stakeHolder: any) => _stakeHolder.status !== "IN_ACTIVE")
                                                                            .map((_stakeHolder: any, index: number) => (
                                                                                <UserQuickView key={index} user={_stakeHolder}>
                                                                                    <SellerAvatar seller={_stakeHolder} size={28} fontSize={12} isOwner={_stakeHolder.role === "OWNER"}/>
                                                                                </UserQuickView>
                                                                            ))
                                                                    }
                                                                </Avatar.Group>
                                                            </div>
                                                        </Space>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </Space>
                        }
                </div>
    )
}

export default Account
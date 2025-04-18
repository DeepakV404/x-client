import { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Avatar, Button, Card, Col, Popconfirm, Radio, Row, Space } from "antd";

import { HUBSPOT_CONTACTS_BY_DEAL } from "../api/hubspot-query";
import { HubspotGlobalContext } from "../hubspot-globals";
import { ERROR_CONFIG } from "../../config/error-config";
import { CommonUtil } from "../../utils/common-util";
import { CONTACT, DEAL } from "../hubspot-constants";
import { HubspotAgent } from "../api/hubspot-agent";

import GetStartedOptions from "../../components/integration/get-started-options";
import UserQuickView from "../../buyer-view/components/user-quick-view";
import CreateRoomModal from "./create-room-modal";
import LatestActivity from "./latest-activity";
import AddContactModal from "./add-contact-modal";
import Loading from "../../utils/loading";

const SelectRoom = (props: {setCurrentView?: any, availableRooms: any, accountRooms: any}) => {

    const { availableRooms, accountRooms, setCurrentView }    =   props;
    const { $orgDetail }                      =   useContext(HubspotGlobalContext);

    let page            =   CommonUtil.__getQueryParams(window.location.search).page;
    let emailId         =   CommonUtil.__getQueryParams(window.location.search).email;
    let firstName       =   CommonUtil.__getQueryParams(window.location.search).firstName;
    let lastName        =   CommonUtil.__getQueryParams(window.location.search).lastName;
    
    const [showModal, setShowModal]             =   useState(false);
    const [showAddContact, setShowAddContact]   =   useState({
        visibility: false,
        roomId: "",
        buyers: []
    });

    const { data , loading}  =   useQuery(HUBSPOT_CONTACTS_BY_DEAL, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true,
        variables: {
            dealId   :   CommonUtil.__getQueryParams(window.location.search).id
        }
    });

    const mapRoom = (_room: any, shouldSendEmail?: any) => {
        
        let contactId      =   CommonUtil.__getQueryParams(window.location.search).id;
        let contactName    =   CommonUtil.__getQueryParams(window.location.search).name;

        HubspotAgent.mapContactToRoom({
            variables: {
                contactId       :   contactId, 
                name            :   contactName,
                roomUuid        :   _room.uuid,
                input           :   shouldSendEmail === "sendNull" ? null :  {
                    emailId     :    emailId,   
                    firstName   :    firstName,
                    lastName    :    lastName
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Room mapped successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })   
    }

    let allRooms = (accountRooms ? accountRooms : []).concat(availableRooms ? availableRooms : [])

    const getRooms = () => {
        if(page === CONTACT){
            return allRooms
        }else{
            return availableRooms ? availableRooms : []
        }
    }

    const libraryURL    =   `${import.meta.env.VITE_APP_DOMAIN}/${$orgDetail.tenantName}/#/library/all-resources`;
    const linksURL      =   `${import.meta.env.VITE_APP_DOMAIN}/${$orgDetail.tenantName}/#/links`;

    if (loading) return <Loading/>

    return (
        <>
            {
                getRooms().length 
                ?
                    <Space className='cm-width100 cm-flex-center' style={{height: "25px", marginBottom: "5px"}}>
                        <Radio.Group value={"rooms"} className='cm-flex' size='small' >
                            <Radio.Button value="rooms" key={"rooms"} className='cm-font-size12 cm-flex' onClick={() => setCurrentView("empty")}>
                                Room
                            </Radio.Button>
                            <Radio.Button value="library" key={"library"}  className='cm-font-size12 cm-flex' onClick={() => setCurrentView("library")}>
                                Library
                            </Radio.Button>
                            <Radio.Button value="links" key={"links"}  className='cm-font-size12 cm-flex' onClick={() => setCurrentView("links")}>
                                Links
                            </Radio.Button>
                        </Radio.Group>
                    </Space>
                    // <Space className='cm-width100 cm-flex-justify-end' style={{height: "40px"}}>
                    //     <a href={libraryURL} target='_blank'><Button size='small'><Space className='cm-font-size12'>Library<MaterialSymbolsRounded font='open_in_new' size='16'/></Space></Button></a>
                    //     <a href={linksURL} target='_blank'><Button size='small' className='cm-font-size12'>Links<MaterialSymbolsRounded font='open_in_new' size='16'/></Button></a>
                    // </Space>
                :
                    null
            }
            <div className="cm-width100" style={{height: getRooms().length ? "calc(100% - 40px)" : "100%"}}>
                {
                    getRooms().length
                    ?
                        <Space className="cm-width100 cm-flex-center j-hubspot-choose-header">
                            <Space direction="vertical" size={5} className="cm-flex-center">
                                <div className="cm-font-fam500 cm-font-size16">Use existing rooms</div>
                                <div className="cm-light-text"> The following rooms belong to the {page === CONTACT ? "accounts" : "contacts"} associated with this {page}</div>
                                <div className="cm-light-text cm-font-size10 cm-margin-block10">OR</div>
                                <Button type="primary" onClick={() => setShowModal(true)} className="cm-font-size12 cm-cursor-pointer">Create new room</Button>
                            </Space>
                        </Space>
                    :
                        <GetStartedOptions setCurrentView={setCurrentView} libraryURL={libraryURL} linksURL={linksURL} handleCreateRoomClick={() => setShowModal(true)}/>
                }
                {
                    getRooms().length
                    ?
                        <div style={{height: "calc(100% - 150px)"}} className="cm-overflow-auto cm-padding10">
                            {
                                availableRooms && availableRooms.length > 0 &&
                                    availableRooms.map((_availableRoom: any) => (
                                        <Card className="cm-margin-bottom10 j-hubspot-room-card">
                                            <Row className="cm-width100">
                                                <Col span={12} className="j-hubspot-room-col">
                                                    <Space direction="vertical" size={0}>
                                                        <div className="cm-font-fam500">{_availableRoom.title}</div>
                                                        <Space size={2}>
                                                            <span className="cm-font-size10 cm-light-text">Last activity : </span>
                                                            {
                                                                _availableRoom.latestActivity ?
                                                                    <LatestActivity activity={_availableRoom.latestActivity}/>
                                                                :
                                                                    <span className="cm-font-size11 cm-light-text">No activities found</span>
                                                            }
                                                        </Space>
                                                    </Space>
                                                </Col>
                                                <Col span={9} className="cm-flex-align-center j-hubspot-room-col">
                                                    {
                                                        _availableRoom.buyers.length > 0 ?
                                                            <Space>
                                                                <div className="cm-font-size10 cm-light-text">Buying Committee</div>
                                                                <Avatar.Group maxCount={4} maxPopoverPlacement='bottom' className="cm-flex-center">
                                                                    {
                                                                        _availableRoom.buyers.map((_stakeHolder: any) => (
                                                                            <UserQuickView user={_stakeHolder} inProduct={false}>
                                                                                <Avatar size={28} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "11px"}} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : ""}>
                                                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                                                                </Avatar>
                                                                            </UserQuickView>
                                                                        ))
                                                                    }
                                                                </Avatar.Group>
                                                            </Space>
                                                        :
                                                            <div className="cm-font-size10 cm-light-text">No members in the buying committee</div>
                                                    }
                                                </Col>
                                                <Col span={3} className="cm-flex-center">
                                                    {
                                                        page === DEAL ?
                                                            <Button 
                                                                type        =   "primary" 
                                                                size        =   "small" 
                                                                onClick     =   {() => setShowAddContact({
                                                                        visibility: true,
                                                                        roomId: _availableRoom.uuid,
                                                                        buyers: _availableRoom.buyers
                                                                    })
                                                                }
                                                            >
                                                                <div className="cm-font-size12">Use Room</div>
                                                            </Button>
                                                        :
                                                            <Popconfirm
                                                                placement           =   "left"  
                                                                title               =   {<div className="cm-font-fam500">Use this room</div>}
                                                                description         =   {<div className="cm-font-size12">Are you sure you want to use this room?</div>}
                                                                icon                =   {null}
                                                                okButtonProps       =   {{style: {fontSize: "10px", color: "#fff !important", boxShadow: "0 0 0"}}}
                                                                cancelButtonProps   =   {{style: {fontSize: "10px"}}}
                                                                onConfirm           =   {() => mapRoom(_availableRoom, "sendNull")}
                                                            >
                                                                <Button size="small" type="primary">
                                                                    <div className="cm-font-size12">Use Room</div>
                                                                </Button>
                                                            </Popconfirm>
                                                    }
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))
                            }
                            {
                                accountRooms && accountRooms.length > 0 &&
                                    accountRooms.map((_accountRooms: any) => (
                                        <Card className="cm-margin-bottom10 j-hubspot-room-card">
                                            <Row className="cm-width100">
                                                <Col span={12} className="j-hubspot-room-col">
                                                    <Space direction="vertical" size={0}>
                                                        <div className="cm-font-fam500">{_accountRooms.title}</div>
                                                        <Space size={2}>
                                                            <span className="cm-font-size10 cm-light-text">Last activity : </span>
                                                            {
                                                                _accountRooms.latestActivity ?
                                                                    <LatestActivity activity={_accountRooms.latestActivity}/>
                                                                :
                                                                    <span className="cm-font-size11 cm-light-text">No activities found</span>
                                                            }
                                                        </Space>
                                                    </Space>
                                                </Col>
                                                <Col span={9} className="cm-flex-align-center j-hubspot-room-col">
                                                    {
                                                        _accountRooms.buyers.length > 0 ?
                                                            <Space>
                                                                <div className="cm-font-size10 cm-light-text">Buying Committee</div>
                                                                <Avatar.Group maxCount={4} maxPopoverPlacement='bottom' className="cm-flex-center">
                                                                    {
                                                                        _accountRooms.buyers.map((_stakeHolder: any) => (
                                                                            <UserQuickView user={_stakeHolder} inProduct={false}>
                                                                                <Avatar size={28} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "11px"}} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : ""}>
                                                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                                                                </Avatar>
                                                                            </UserQuickView>
                                                                        ))
                                                                    }
                                                                </Avatar.Group>
                                                            </Space>
                                                        :
                                                            <div className="cm-font-size10 cm-light-text">No members in the buying committee</div>
                                                    }
                                                </Col>
                                                <Col span={3} className="cm-flex-center">
                                                    <Popconfirm
                                                        placement           =   "left"  
                                                        title               =   {<div className="cm-font-fam500">Use this room</div>}
                                                        description         =   {<div className="cm-font-size12">Are you sure you want to use this room?</div>}
                                                        icon                =   {null}
                                                        okButtonProps       =   {{style: {fontSize: "10px", color: "#fff !important", boxShadow: "0 0 0"}}}
                                                        cancelButtonProps   =   {{style: {fontSize: "10px"}}}
                                                        onConfirm           =   {() => mapRoom(_accountRooms)}
                                                    >
                                                        <Button size="small" type="primary">
                                                            <div className="cm-font-size12">Use Room</div>
                                                        </Button>
                                                    </Popconfirm>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))
                            }
                        </div>
                    :
                        null
                }
            </div>
            <CreateRoomModal
                isOpen  =   {showModal}
                onClose =   {() => setShowModal(false)}
            />
            <AddContactModal
                isOpen              =   {showAddContact.visibility}
                onClose             =   {() => setShowAddContact({visibility: false, roomId: "", buyers: []})}
                contacts            =   {data?._hsGetContactsByDeal}
                availableContacts   =   {showAddContact.buyers}
                roomId              =   {showAddContact.roomId}
            />
        </>
    )
}

export default SelectRoom
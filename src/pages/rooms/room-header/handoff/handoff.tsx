import { useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar,  Button,  Collapse, Divider, Space, Tag, Typography } from "antd";

import { FEATURE_ROOMS } from "../../../../config/role-permission-config";
import { PermissionCheckers } from "../../../../config/role-permission";
import { NO_NOTES_FOUND } from "../../../../constants/module-constants";
import { CommonUtil } from "../../../../utils/common-util";
import { R_HANDOFF_HISTORY } from "../../api/rooms-query";
import { GlobalContext } from "../../../../globals";

import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import Loading from "../../../../utils/loading";
import AddNoteModal from "./add-note-modal";

const { Text }    =   Typography;

const Handoff = () => {
    
    const params    =   useParams();

    const [ showAddNote, setShowAddNote ]  =    useState(false);

    const { $user }     =    useContext(GlobalContext);

    const RoomAddNotePermission     =  PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const { data, loading, error } = useQuery(R_HANDOFF_HISTORY, {
        variables: {
            roomUuid: params.roomId,
        },
        fetchPolicy: "network-only",
    });

    if(loading) return <Loading />
    if(error) return <SomethingWentWrong />

    return (
        <>
            <div className="cm-padding15 cm-height100 cm-overflow-auto" style={{ background: "#F1F4F7" }}>
                <Space style={{width: "calc(100vw - 600px)",margin: "0 auto", minWidth: "500px"}} className="j-room-add-note cm-flex-space-between cm-margin-bottom15">
                    <Space className="cm-flex " size={2}>
                        <MaterialSymbolsRounded font="info" size="20" color="var(--primary-color)" filled/>
                        This notes is for internal purpose only
                    </Space>
                    <Button disabled={!RoomAddNotePermission} onClick={() => RoomAddNotePermission ? setShowAddNote(true) : null} ghost type="primary" className={`${RoomAddNotePermission ? "cm-cursor-pointer" : ""} cm-border-light cm-padding10 cm-flex-center cm-border-radius4 cm-icon-button`}>
                        <Space size={4} className="cm-flex"><MaterialSymbolsRounded font="add" size="22"/> Add Note</Space>
                    </Button>
                </Space>
                {
                    data._rHandoffsHistory.length > 0
                    ?
                        <div
                            className   =   {`cm-flex-center cm-background-white cm-border-light cm-overflow-auto cm-border-radius4`}
                            style       =   {{ width: "calc(100vw - 600px)",margin: "0 auto", minWidth: "500px"}}
                        >
                            <Collapse
                                className           =   "cm-width100 cm-height100  cm-background-white"
                                bordered            =   {false}
                                expandIcon          =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                                defaultActiveKey    =   {data._rHandoffsHistory[0].uuid}
                            >
                                {
                                    data._rHandoffsHistory.map((_handoffItem: any) => (
                                        <CollapsePanel
                                            className   =   "j-note-collapse"
                                            collapsible =   {_handoffItem.note ? undefined : "disabled"}
                                            style       =   {{background: "#fff"}}
                                            key         =   {_handoffItem.uuid}
                                            header      =   {
                                                <div className="cm-flex-space-between">
                                                    <Space direction="vertical">
                                                        {
                                                            (_handoffItem.fromStage && _handoffItem.toStage) ?
                                                                <Space className="cm-flex cm-font-size13">
                                                                    <Tag
                                                                        style={{
                                                                            paddingInline   :   "8px",
                                                                            paddingBlock    :   "2px",
                                                                            margin          :   "0px",
                                                                            border          :   'none',
                                                                            backgroundColor :   `${_handoffItem.fromStage?.properties?.color ?? "#DCDCDC"}26`,
                                                                            color           :   _handoffItem.fromStage?.properties?.color
                                                                        }}
                                                                    >
                                                                        <span style={{ color: _handoffItem.fromStage?.properties?.color }}>
                                                                            {_handoffItem?.fromStage?.label}
                                                                        </span>
                                                                    </Tag>
                                                                    <MaterialSymbolsRounded font="arrow_right_alt" size="22" color="#000000e0"/>
                                                                    <Tag
                                                                        style={{
                                                                            paddingInline   :   "8px",
                                                                            paddingBlock    :   "2px",
                                                                            margin          :   "0px",
                                                                            border          :   'none',
                                                                            backgroundColor :   `${_handoffItem.toStage?.properties?.color ?? "#DCDCDC"}26`,
                                                                            color           :   _handoffItem.toStage?.properties?.color
                                                                        }}
                                                                    >
                                                                        <span style={{ color: _handoffItem.toStage?.properties?.color }}>
                                                                            {_handoffItem?.toStage?.label}
                                                                        </span>
                                                                    </Tag>
                                                                </Space>
                                                            :
                                                                _handoffItem?.handedFrom || _handoffItem?.handedTo?.uuid ?
                                                                    <Tag
                                                                        style={{
                                                                            paddingInline   :   "8px",
                                                                            paddingBlock    :   "2px",
                                                                            margin          :   "0px",
                                                                            border          :   'none',
                                                                            backgroundColor :   "#EDD6FF",
                                                                            color           :   "#9D4CDC"
                                                                        }}
                                                                    >
                                                                        <span style={{ color: "#9D4CDC" }}>
                                                                            Handoff
                                                                        </span>
                                                                    </Tag>
                                                                :
                                                                    null
                                                        }
                                                        {
                                                            (_handoffItem?.handedFrom?.uuid !== _handoffItem?.handedTo?.uuid )
                                                                ?
                                                                    <Text className="cm-font-fam500">
                                                                        {
                                                                            _handoffItem.handedFrom ? 
                                                                                <><span className="cm-font-fam400">Room owner was changed from </span>{CommonUtil.__getFullName(_handoffItem.handedFrom?.firstName, _handoffItem.handedFrom?.lastName)} <span className="cm-font-fam400">to</span> {CommonUtil.__getFullName(_handoffItem.handedTo.firstName, _handoffItem.handedTo.lastName)}</>
                                                                            :
                                                                                <><span className="cm-font-fam400">Room owner was set to </span>{CommonUtil.__getFullName(_handoffItem.handedTo.firstName, _handoffItem.handedTo.lastName)}</>
                                                                        }
                                                                        <span className="cm-font-fam400">{_handoffItem.note ? " with a note." : ""}</span>
                                                                    </Text>
                                                                :
                                                                _handoffItem?.type === "GENERAL_NOTE" ? <strong className="cm-font-size13 cm-font-fam500">Note</strong> : <Text>Room's stage was updated {_handoffItem.note ? "with a note." : ""}</Text>
                                                        }
                                                    </Space>
                                                    <Space direction="vertical" className="cm-flex-space-between">
                                                        <Space size={0}>
                                                            <Space size={0} className="cm-flex-align-center cm-secondary-text cm-font-size12">
                                                                {CommonUtil.__getFullName(_handoffItem.createdBy.firstName, _handoffItem.createdBy.lastName)}        
                                                            </Space>
                                                            <Divider type="vertical" />
                                                            <div className="cm-font-size12 cm-secondary-text">{CommonUtil.__getDateDayYear(_handoffItem.createdAt)}, {CommonUtil.__format_AM_PM(_handoffItem.createdAt)}</div>
                                                        </Space>
                                                        {
                                                            _handoffItem?.handedFrom && _handoffItem?.handedTo && _handoffItem?.handedFrom?.uuid !== _handoffItem?.handedTo?.uuid &&
                                                                <Space className="cm-flex-justify-end" size={0}>
                                                                    <Avatar size={20} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex" }} src={_handoffItem.handedFrom.profileUrl ? <img src={_handoffItem.handedFrom.profileUrl} alt={CommonUtil.__getFullName(_handoffItem.handedFrom.firstName, _handoffItem.handedFrom.lastName)}/> : ""}>
                                                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_handoffItem.handedFrom.firstName, _handoffItem.handedFrom.lastName), 1)}
                                                                    </Avatar>
                                                                    <MaterialSymbolsRounded font="arrow_right_alt" size="16" color="#000000e0"/>
                                                                    <Avatar size={20} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex" }} src={_handoffItem.handedTo.profileUrl ? <img src={_handoffItem.handedTo.profileUrl} alt={CommonUtil.__getFullName(_handoffItem.handedTo.firstName, _handoffItem.handedTo.lastName)}/> : ""}>
                                                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_handoffItem.handedTo.firstName, _handoffItem.handedTo.lastName), 1)}
                                                                    </Avatar>
                                                                </Space>
                                                        }
                                                    </Space>
                                                </div>
                                            }
                                        >
                                            <div style={{paddingInline: "35px"}}>
                                                {
                                                    _handoffItem.note
                                                        ?
                                                            _handoffItem?.type === "GENERAL_NOTE" ?
                                                                <div className="cm-padding0 cm-padding-block5 ql-editor cm-quill-font cm-padding-bottom10" dangerouslySetInnerHTML={{__html: _handoffItem.note}}></div>
                                                            :
                                                                <Space direction="vertical" size={0}>
                                                                    <strong className="cm-font-size13 cm-font-fam500">Note</strong>
                                                                    <div className="cm-padding0 cm-padding-block10 ql-editor cm-quill-font" dangerouslySetInnerHTML={{__html: _handoffItem.note}}></div>
                                                                </Space>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </CollapsePanel>
                                    ))
                                }
                            </Collapse>
                        </div>
                    :
                        <Space direction="vertical"  style={{height: "calc(100% - 47px)"}} className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-overflow-auto">
                            <img src={NO_NOTES_FOUND} alt="No next steps found" className="cm-margin-bottom15" width={160} height={160}/>
                            <div className="cm-font-size18 cm-font-fam500">No Notes Available</div>
                            <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                                Add your internal, handoff, or stage change notes here.
                            </div>
                            {
                                RoomAddNotePermission &&
                                    <Button className="cm-flex-center cm-margin-top15" type="primary" onClick={() => RoomAddNotePermission ? setShowAddNote(true) : null} style={{marginLeft: "9px"}}>
                                        Add Note
                                    </Button>
                            }
                        </Space>
                }
            </div>
            <AddNoteModal isOpen={showAddNote} onClose={() => setShowAddNote(false)} blankNote={true}/>
        </>
    );
};

export default Handoff;

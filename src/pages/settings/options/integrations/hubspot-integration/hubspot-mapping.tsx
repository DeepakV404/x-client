import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { HexColorPicker } from "react-colorful";
import { Alert, Badge, Button, Col, List, Popover, Row, Select, Space, Typography } from "antd"
import { SyncOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

import { CRM_DEAL_STAGE_MAPPINGS } from "../../../../common/api/crm-query";
import { CommonUtil } from "../../../../../utils/common-util";
import { CRMAgent } from "../../../../common/api/crm-agent";
import { SettingsAgent } from "../../../api/settings-agent";
import { ROOM_STAGES } from "../../../api/settings-query";

import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";

const { Text }      =   Typography;
const { Option }    =   Select;

interface RoomStageType{
    uuid                    :   string;
    label                   :   string;
    isCRMDealStageMapped    :   boolean
    properties              :   {
        color: string;
    };
}


interface MappingItemType {
    crmDealStage : {
        id      :   string;
        label   :   string;
    }
    bsStage : RoomStageType | null;
}

const HubspotMapping = () => {

    const navigate                                      =   useNavigate();

    const { data, loading }                             =   useQuery<{ _crmDealStageMappings: MappingItemType[] | [] }>(CRM_DEAL_STAGE_MAPPINGS);

    const { data: stageData, loading: stageLoading }    =   useQuery<{ roomStages: RoomStageType[] | []}>(ROOM_STAGES);

    const [isSyncing, setIsSyncing] =   useState<boolean>(false);

    const handleSyncNow = () => {
        setIsSyncing(true)
        CRMAgent._updateLatestDealStages({
            onCompletion: () => {
                setIsSyncing(false)
                CommonUtil.__showSuccess("Synced successfully!")
            },
            errorCallBack: () => {
               setIsSyncing(false) 
               CommonUtil.__showError("Something went wrong!")
            }
        })
    }

    const handleColorChange = debounce((bsStage: RoomStageType, color: string) => {

        let stageProps      =   {...bsStage.properties};
        stageProps["color"] =   color;

        SettingsAgent.updateRoomStage({
            variables: {
                roomStageUuid   :   bsStage.uuid,
                roomStageInput  :   {
                    properties: stageProps
                }
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }, 1000)

    const handleMappingChange = (bsStageId: string, crmStageId: string, defaultBSStageId?: string) => {
        if(!bsStageId && defaultBSStageId){
            CRMAgent._mapRoomStage({
                variables: {
                    crmDealStageId  :   "",
                    bsStageUuid     :   defaultBSStageId
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })
        }else{
            CRMAgent._mapRoomStage({
                variables: {
                    crmDealStageId  :   crmStageId,
                    bsStageUuid     :   bsStageId
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })
        }
    }

    const ListItem = (mappingItemProps: MappingItemType) => {

        const { crmDealStage, bsStage }   = mappingItemProps;

        return (
            <List.Item key={crmDealStage.id} style={{border: "none", height: "50px", background: `${!bsStage ? "#FFF4F4" : "transparent"}`}}>
                <Row className="cm-width100">
                    <Col span={10} className="cm-flex-align-center">{crmDealStage.label}</Col>
                    <Col span={2} className="cm-flex-align-center"><MaterialSymbolsRounded size="22" font="arrow_forward"/></Col>
                    <Col span={12} className="cm-font-fam500 cm-flex-align-center cm-width100">
                        <Space className="cm-width100 cm-flex-space-between">
                            <Space size={10}>
                                <Select
                                    defaultValue    =   {bsStage?.uuid}
                                    suffixIcon      =   {<MaterialSymbolsRounded font="expand_more" color="#5C5A7C" />}
                                    placeholder     =   {"Select a stage"}
                                    style           =   {{width: "250px"}}
                                    className       =   "j-stage-select"
                                    onChange        =   {(selectedBSStageId: string) => handleMappingChange(selectedBSStageId, crmDealStage.id, bsStage?.uuid)}
                                    loading         =   {stageLoading}
                                    disabled        =   {stageLoading}
                                    optionFilterProp=   "filter"
                                    allowClear
                                    showSearch
                                >
                                    {
                                        stageData?.roomStages.map((_roomStage: RoomStageType) => (
                                            <Option className="j-room-stage-dropdown-option" key={_roomStage.uuid} filter={_roomStage?.label} disabled={_roomStage.isCRMDealStageMapped}>
                                                <Space key={_roomStage.uuid} className="cm-flex">
                                                    <Badge color={_roomStage?.properties?.color}></Badge>
                                                    <Text style={{ display: "block", maxWidth: "190px" }} ellipsis={{ tooltip: _roomStage?.label }}>{_roomStage?.label}</Text>
                                                </Space>
                                            </Option>
                                        ))
                                    }
                                </Select>
                                {
                                    bsStage &&
                                        <Popover
                                            content =   {<HexColorPicker color={bsStage?.properties?.color ? bsStage.properties.color : "#DCDCDC"} onChange={(color) => handleColorChange(bsStage, color)}/>}
                                            trigger =   {["click"]}
                                        >
                                            <div 
                                                className       =   {"j-stage-color-picker-trigger"}
                                                style           =   {{background: `${bsStage?.properties?.color ? bsStage.properties.color : "#DCDCDC"}4D`, border: `1px solid ${bsStage?.properties?.color ? bsStage.properties.color : "#DCDCDC"}`, width: "20px", height: "20px", borderRadius: "6px"}}
                                            ></div>
                                        </Popover>
                                }
                            </Space>
                            {
                                !bsStage && <MaterialSymbolsRounded font="info" size="20" color="#F65757" filled/>
                            }
                        </Space>
                    </Col>
                </Row>
            </List.Item>
        )
    }

    const unmappedStages = data?._crmDealStageMappings.filter((_mapping: MappingItemType) => !_mapping.bsStage).length;

    const handleCreateStageClick = () => {
        navigate("/settings/options/room-stages")
    }

    return (
        <div className="cm-padding15">
            <div style={{width: "750px"}}>
                <Space className="cm-width100 cm-flex-space-between">
                    <Space direction="vertical">
                        <div className="cm-font-fam500 cm-font-size16">Mapping</div>
                        <div className="cm-font-opacity-black-65 cm-font-size13">Manage your HubSpot Deal stage mappings.</div>
                    </Space>
                    <Button style={{width: "100px"}} className="cm-font-size12" icon={isSyncing || loading ? <SyncOutlined spin /> : <MaterialSymbolsRounded font="sync" size="16"/>} size="small" onClick={handleSyncNow}>
                        Sync now
                    </Button>
                </Space>
                {
                    unmappedStages ? 
                        <Alert message={`${unmappedStages} Buyerstage fields are not matched to HubSpot fields. Please match them to the sync deal pipeline.`} type="error" showIcon style={{border: "none", color: "#F65757"}} className="cm-margin-top20"/>
                    :
                        null
                }
                <List
                    bordered
                    className   =   "j-settings-stage-mapping-list cm-margin-top20"
                    size        =   "small"
                    dataSource  =   {data?._crmDealStageMappings}
                    renderItem  =   {(item) => <ListItem {...item}/>}
                    loading     =   {loading}
                    header      =   {
                        <Row>
                            <Col span={10} className="cm-flex-align-center cm-font-fam500">HubSpot Stage</Col>
                            <Col span={2} className="cm-flex-align-center"><MaterialSymbolsRounded size="22" font="arrow_forward" color="#0065E5"/></Col>
                            <Col className="cm-font-fam500" span={12}>
                                <Space className="cm-flex-space-between"> 
                                    Buyerstage Stage
                                    <a className="cm-font-size12" type="link" onClick={handleCreateStageClick}> Create Stages </a>
                                </Space>
                            </Col>
                        </Row>}
                />
            </div>
        </div>
    )
}

export default HubspotMapping
import { useState } from "react";
import { Avatar, Button, Collapse, Form, Select, Space, Switch, Typography } from "antd";

import { ERROR_CONFIG } from "../../../../../config/error-config";
import { CommonUtil } from "../../../../../utils/common-util";
import { RoomsAgent } from "../../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";

const { Option }    =   Select;
const { Text }      =   Typography;
const { Panel }     =   Collapse;
const { useForm }   =   Form;

const SectionAccessManager = (props: { entityData : any, sectionData: any}) => {

    const { entityData, sectionData }    =   props;
    const [form]    =   useForm();

    const [accessState, setAccessState]     =   useState<boolean>(sectionData.isProtected);

    const getFilteredBuyers = () => {
        return entityData.buyers.filter((_buyer: any) => sectionData.visibleBuyers.every((_visibleBuyer: any) => _visibleBuyer.uuid !== _buyer.uuid))
    }

    const handleAccessPermission = (visibility: boolean) => {
        setAccessState(visibility)
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: sectionData.uuid,
                input: {
                    visibleToAll    :   !visibility
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Section permission updated successfully")
            },
            errorCallBack: (error: any) => {
                setAccessState(!visibility)
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const onAddPermission = (values: any) => {
        RoomsAgent.addSectionPermission({
            variables: {
                roomUuid    :   entityData.uuid,
                sectionUuid :   sectionData.uuid, 
                buyerUuids  :   values.permissionList
            },
            onCompletion: () => {
                form.resetFields()
                CommonUtil.__showSuccess("Permission added successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const onRemovePermission = (buyerId: any) => {
        RoomsAgent.removeSectionPermission({
            variables: {
                roomUuid    :   entityData.uuid,
                sectionUuid :   sectionData.uuid, 
                buyerUuids  :   [buyerId]
            },
            onCompletion: () => {
                form.resetFields()
                CommonUtil.__showSuccess("Permission removed successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <div className="cm-width100">
            <div className="cm-font-size16 cm-flex-align-center cm-modal-header cm-font-fam500">Access Control</div>
            <div className="cm-padding15">
                <Space className="cm-width100 cm-flex-space-between">
                    <Space className="cm-flex-align-center">
                        <MaterialSymbolsRounded font={accessState ? "lock" : "lock_open"} color={accessState ? "#0065E5" : "#5F6368"} size="22"/>
                        <div className="cm-secondary-text">Allow access only to specific buyers</div>
                    </Space>
                    <Switch onChange={(switchState: boolean) => handleAccessPermission(switchState)} size="small" defaultChecked={accessState}/>
                </Space>
                <Form form={form} onFinish={onAddPermission} className="cm-form cm-width100 cm-margin-top20">
                    <div className="cm-flex cm-gap8 cm-width100">
                        <Form.Item 
                            name        =   {"permissionList"} 
                            className   =   "cm-width100" 
                            rules       =   {[{required: true, message: "Select users to permit access"}]}
                            extra       =   {!accessState ? <Space className="cm-margin-top10 cm-font-size12"><MaterialSymbolsRounded font="info" size="18"/>Enable "allow access only to specific users" and add buyers</Space> : null}
                        >
                            <Select 
                                popupClassName  =   "j-access-manager-list-popup"
                                style           =   {{width: "100%"}}
                                placeholder     =   {"Add by name or email"}
                                optionLabelProp =   "label"
                                optionFilterProp=   "label"
                                mode            =   "multiple"
                                suffixIcon      =   {<MaterialSymbolsRounded font="expand_more" color="#5C5A7C" size="22"/>}
                                notFoundContent     =   {
                                    <div style={{ height: "50px" }} className="cm-flex-center">
                                        <div className="cm-empty-text cm-font-size12">No buyers found</div>
                                    </div>
                                }
                            >
                                {
                                    getFilteredBuyers().map((_buyer: any) => (
                                        <Option value={_buyer.uuid} label={CommonUtil.__getFullName(_buyer.firstName, _buyer.lastName)}>
                                            <Space className="cm-widht100" size={10}>
                                                <Avatar size={25} style = {{color: "#000", fontSize: "10px", display: "flex", background: "#eeeeee" }} src={_buyer.profileUrl ? <img src={_buyer.profileUrl} alt={CommonUtil.__getFullName(_buyer.firstName, _buyer.lastName)}/> : null}>
                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_buyer.firstName, _buyer.lastName), 2)}
                                                </Avatar>
                                                <Text className="cm-font-fam500">{CommonUtil.__getFullName(_buyer.firstName, _buyer.lastName)}</Text>
                                            </Space>
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button disabled={!accessState} htmlType="submit" type="primary">Add</Button>
                        </Form.Item>
                    </div>
                </Form>
                {
                    (accessState && sectionData.visibleBuyers.length > 0) ?
                        <Collapse
                            defaultActiveKey    =   {["access-permission-list"]}
                            rootClassName       =   'j-access-manager-collapse-root'
                            bordered            =   {false}
                            expandIcon          =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="expand_more" size='22' /> : <MaterialSymbolsRounded font="chevron_right" size='22' />}
                        >
                            <Panel
                                key     =   {"access-permission-list"}
                                header  =   {
                                    <div className="cm-font-fam500 cm-font-size15">Shared with</div>
                                }
                            >
                                <Space direction="vertical" className="cm-width100" size={12}>
                                    {
                                        sectionData.visibleBuyers.map((_permittedBuyer: any) => (
                                            <div className="cm-widht100 cm-flex-space-between cm-flex-align-center">
                                                <Space size={10}>
                                                    <Avatar shape="square" size={30} style = {{color: "#000", fontSize: "10px", display: "flex", background: "#eeeeee" }} src={_permittedBuyer.profileUrl ? <img src={_permittedBuyer.profileUrl} alt={CommonUtil.__getFullName(_permittedBuyer.firstName, _permittedBuyer.lastName)}/> : null}>
                                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_permittedBuyer.firstName, _permittedBuyer.lastName), 2)}
                                                    </Avatar>
                                                    <Text className="cm-font-fam500">{CommonUtil.__getFullName(_permittedBuyer.firstName, _permittedBuyer.lastName)}</Text>
                                                </Space>
                                                <Button size="small" className="cm-font-size11" onClick={() => onRemovePermission(_permittedBuyer.uuid)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        ))
                                    }
                                </Space>
                            </Panel>
                        </Collapse>
                    :
                        null
                }
            </div>
        </div>
    )
}

export default SectionAccessManager
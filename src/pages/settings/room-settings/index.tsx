import { useContext, useState } from 'react';
import { Button, Form, Input, message, Select, Space, Tooltip } from 'antd';

import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { SettingsAgent } from '../api/settings-agent';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import GetRoomEngagementStatus from '../../../components/get-room-engagement-status';
import { GlobalContext } from '../../../globals';

const { Option }    =   Select;
const { useForm }   =   Form;

export interface OverallRoomSettingsPropType
{
    settings: {
        statusBase  :   "DAYS" | "ACTIVITIES_COUNT";
        noOfDays    :   number;
        hotCount    :   number;
        warmCount   :   number;
    }
}

const OverallRoomSettings = (props: OverallRoomSettingsPropType) => {

    const [form]    =   useForm();

    const { $dictionary }    =   useContext(GlobalContext);

    const { settings }  =   props;

    const [statusBase, setStatusBase]   =   useState<"DAYS" | "ACTIVITIES_COUNT">(settings.statusBase);

    const [noOfDays, setNoOfDays]       =   useState<number>(settings.noOfDays);

    const onFinish = (values: any) => {

        const loading = message.loading("Updating...", 0);

        const engagementJson = {
            configurationType   :   statusBase,
            noOfDays            :   values.noOfDays ? parseInt(values.noOfDays) : noOfDays,
            hotCount            :   parseInt(values.hotField),
            warmCount           :   parseInt(values.warmField)
        }

        SettingsAgent.updateEngagementStatusSettings({
            variables: {
                input: engagementJson
            },
            onCompletion: () => {
                loading()
                CommonUtil.__showSuccess("Updated successfully!")
            },
            errorCallBack: (error: any) => {
                loading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <div className="cm-height100">
            <div className="cm-width100 j-setting-header cm-flex-space-between" style={{height: "55px"}}>
                <Space>
                    <MaterialSymbolsRounded font="roofing" size="22" color="#0065E5"/>
                    <div className="cm-font-size16 cm-font-fam500">{$dictionary.rooms.singularTitle} Settings</div> 
                </Space>
                <Button type='primary' onClick={() => {form.submit()}}>Update</Button>
            </div>  
            <Form 
                className   =   'cm-form'
                form        =   {form}
                style       =   {{height: "calc(100% - 55px)"}}
                onFinish    =   {onFinish}
            >
                <div style={{background: "#F5F7F9"}} className='cm-flex-justify-center cm-height100'>
                    <div className='j-room-settings-status-config-card-wrapper cm-padding15'>
                        <Space direction='vertical' size={3} className='cm-width100'>
                            <div className='cm-font-fam600 cm-font-size15'>{$dictionary.rooms.singularTitle} Status Configuration</div>
                            <div className='cm-font-size13 cm-font-opacity-black-65'>Setup a rule for assigning Hot, Warm, or Cold  as values to {$dictionary.rooms.singularTitle} Status</div>
                        </Space>
                        <Space style={{marginTop: "30px"}}>
                            <div className='cm-font-size13'>Apply Status based on</div>
                            <Select style={{width: "130px"}} value={statusBase} onChange={(value) => setStatusBase(value)} suffixIcon={<MaterialSymbolsRounded font="expand_more" color="#5C5A7C"/>}>
                                <Option key={"DAYS"}>Days</Option>
                                <Option key={"ACTIVITIES_COUNT"}>Interactions</Option>
                            </Select>
                        </Space>
                        {
                            statusBase === "ACTIVITIES_COUNT" ?
                                <Space style={{marginTop: "40px"}} className='cm-width100'>
                                    <Space className='cm-font-size13 cm-font-opacity-black-65 cm-flex-align-center'>
                                        <div>Enter no.of days</div>
                                        <Tooltip title={"Below Interactions is applicable only for entered days"}>
                                            <div><MaterialSymbolsRounded font='info' size='18'/></div>
                                        </Tooltip>
                                    </Space>
                                    <Form.Item 
                                        noStyle
                                        name        =   {"noOfDays"}
                                        initialValue=   {noOfDays}
                                        rules       =   {[{
                                            required: true
                                        }]}
                                    >
                                        <Input style={{width: "150px"}} addonAfter="Days" type='number' min={1} onChange={(event) => setNoOfDays(parseInt(event.target.value))}/>
                                    </Form.Item>
                                </Space>
                            :
                                null
                        }
                            <Space direction='vertical' style={{marginTop: "30px"}} className='cm-width100' size={15}>
                                {/* Hot */}
                                <Space style={{border: "1px solid #E8E8EC", borderRadius: "4px", padding: "6px 12px"}}>
                                    {/* <span style={{lineHeight: "22px"}} className='cm-font-opacity-black85'>Buyer has interacted with the room in {statusBase === "DAYS" ? <span className='cm-font-fam600'> the last  &nbsp; </span> : <span className='cm-font-fam600'>more than</span>}</span> */}
                                    {
                                        statusBase === "DAYS" ? 
                                            <span style={{lineHeight: "22px"}}> Buyer has interacted with the room in <span className='cm-font-fam600'>less than &nbsp; </span></span>
                                        :
                                            <span>Buyer has <span className='cm-font-fam600'>more than</span></span>
                                    }
                                    <Tooltip title={`This value must be ${statusBase === "DAYS" ? "lesser" : "more"} than the ⛅ warm field`} placement='top'>
                                        <div>
                                            <Form.Item 
                                                noStyle
                                                name            =   {"hotField"}
                                                rules={[{
                                                    required: true,
                                                }]}
                                                initialValue    =   {settings.hotCount}
                                            >
                                                <Input style={{width: "80px"}} type='number' min={1}/>
                                            </Form.Item>
                                        </div>
                                    </Tooltip>
                                    {
                                        statusBase === "DAYS" ? 
                                            <span style={{lineHeight: "22px"}}>Days =</span>
                                        :
                                            <span style={{lineHeight: "22px"}}>interactions with the room in last {noOfDays} days =</span>
                                    }
                                    <GetRoomEngagementStatus roomStatus={"HOT"}/>
                                </Space>
                                {/* Hot */}

                                {/* Warm */}
                                <Space style={{border: "1px solid #E8E8EC", borderRadius: "4px", padding: "6px 12px"}}>
                                    {/* <span style={{lineHeight: "22px"}} className='cm-font-opacity-black85'>Buyer has interacted with the room in {statusBase === "DAYS" ? <span className='cm-font-fam600'> the last &nbsp; </span> : <span className='cm-font-fam600'>more than</span>}</span> */}
                                    {
                                        statusBase === "DAYS" ? 
                                            <span style={{lineHeight: "22px"}}> Buyer has interacted with the room in <span className='cm-font-fam600'>less than &nbsp; </span></span>
                                        :
                                            <span>Buyer has <span className='cm-font-fam600'>more than</span></span>
                                    }
                                    <Tooltip title={`This value must be ${statusBase === "DAYS" ? "more" : "lesser"} than the 🔥 hot field`} placement='bottom'>
                                        <div>
                                            <Form.Item 
                                                noStyle
                                                name            =   {"warmField"} 
                                                dependencies    =   {["hotField", "noOfDays"]}
                                                initialValue    =   {settings.warmCount}
                                                rules={[
                                                    {
                                                    required: true,
                                                    },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if(statusBase === "DAYS"){
                                                                if(parseInt(getFieldValue('hotField')) >= parseInt(value)){
                                                                    return Promise.reject(null);
                                                                }else{
                                                                    return Promise.resolve();
                                                                }
                                                            }else{
                                                                if(parseInt(getFieldValue('hotField')) <= parseInt(value)){
                                                                    return Promise.reject(new Error('The value must be more than the Hot fileds value!'));
                                                                }
                                                                else{
                                                                    return Promise.resolve();
                                                                }
                                                            }
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input style={{width: "80px"}} type='number' min={1}/>
                                            </Form.Item>
                                        </div>
                                    </Tooltip>
                                    {
                                        statusBase === "DAYS" ? 
                                            <span style={{lineHeight: "22px"}}>Days =</span>
                                        :
                                            <span style={{lineHeight: "22px"}}>interactions with the room in last {noOfDays} days =</span>
                                    }
                                    <GetRoomEngagementStatus roomStatus={"WARM"}/>
                                </Space>
                                {/* Warm */}

                                {/* Cold */}
                                <Space style={{border: "1px solid #E8E8EC", borderRadius: "4px", padding: "6px 12px"}}>
                                    {
                                        statusBase === "DAYS" ? 
                                            <span style={{lineHeight: "22px"}}> Buyer has interacted with the room in <span className='cm-font-fam600'>more than</span></span>
                                        :
                                            <span>Buyer has <span className='cm-font-fam600'>less than &nbsp; </span></span>
                                    }
                                    {/* <span style={{lineHeight: "22px"}} className='cm-font-opacity-black85'>Buyer has interacted with the room {statusBase === "ACTIVITIES_COUNT" ? <span className='cm-font-fam600'>less than &nbsp; </span> : <span className='cm-font-fam600'>before the last</span>}</span> */}
                                    <Form.Item 
                                        noStyle
                                        name        =   {"warmField"}
                                    >
                                        <Input style={{width: "80px"}} type='number' min={1} readOnly disabled/>
                                    </Form.Item>
                                    {
                                        statusBase === "DAYS" ? 
                                            <span style={{lineHeight: "22px"}}>Days =</span>
                                        :
                                            <span style={{lineHeight: "22px"}}>interactions with the room in last {noOfDays} days =</span>
                                    }
                                    <GetRoomEngagementStatus roomStatus={"COLD"}/>
                                </Space>
                                {/* Cold */}
                            </Space>

                        {/* Not Engaged */}
                        <Space style={{marginTop: "40px"}}>
                            <div className='cm-font-opacity-black-65'>NOTE: The seller has not invited any buyers, or at least one buyer has not accepted the invitation.</div>
                            <GetRoomEngagementStatus roomStatus={"NOT_ENGAGED"}/>
                        </Space>
                        {/* Not Engaged */}
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default OverallRoomSettings
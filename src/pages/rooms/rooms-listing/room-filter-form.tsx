import { FC, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Avatar, Badge, Button, Form, Select, Space, Typography } from "antd";

import { ROOM_TEMPLATES } from "../../templates/api/room-templates-query";
import { REGIONS, ROOM_STAGES, USERS } from "../../settings/api/settings-query";
import { CommonUtil } from "../../../utils/common-util";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import { GlobalContext } from "../../../globals";

const { useForm }       =    Form;
const { Option }        =    Select;
const { Text }          =    Typography;

interface RoomFilterFormProps
{
    setFilter       :   (arg0: any) => void;
    onClose         :   () => void;
    resetFilter     :   any;
    initialFilter   :   any;
    isFilterApplied :   any;
}

const RoomFilterForm: FC<RoomFilterFormProps> = (props) => {

    const { onClose, setFilter, resetFilter, initialFilter, isFilterApplied }   =   props;

    const [form]    =   useForm();

    const { $dictionary, $isVendorMode, $isVendorOrg }   =   useContext(GlobalContext);

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const { data, loading, error }  =   useQuery(ROOM_TEMPLATES);

    const { data: uData, loading: uLoading, error: uError }  =   useQuery(USERS, {
        fetchPolicy: "network-only"
    });

    const { data: regionsData } = useQuery(REGIONS, {
        fetchPolicy: "network-only"
    });

    const { data: rsData } = useQuery(ROOM_STAGES, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        form.setFieldsValue(initialFilter);
        handleValuesChange();
    }, [initialFilter]);

    const handleValuesChange = () => {
        const values = form.getFieldsValue();
        const isEmpty = Object.values(values).every((value: any) => value === undefined || (value.length === 0));
        setIsButtonDisabled(isEmpty);
    };

    const languages = [
        {
            key: 'en',
            label: "en - English",
        },
        {
            key: 'fr',
            label: "fr - French",
        },
        {
            key: 'de',
            label: "de - German",
        },
        {
            key: 'es',
            label: "es - Spanish",
        },
    ]

    const discovery = [
        {
            key    :  "enabled",
            label  :  <div className='cm-font-fam400'>Enabled</div>,
        },
        {
            key    :  "disabled",
            label  :  <div className='cm-font-fam400'>Disabled</div>,
        }
    ]

    const handleReset = () => {
        resetFilter()
        form.setFieldsValue({
            "stage"             :   undefined,
            "status"            :   undefined,
            "template"          :   undefined,
            "account"           :   undefined,
            "createdBy"         :   undefined,
            "language"          :   undefined,
            "discoveryEnabled"  :   undefined,
            "region"            :   undefined,
            "engagementStatus" :   undefined
        })
    }

    const applyFilter = () => {
        let filter: { [key: string]: any } = {};

        Object.keys(form.getFieldsValue()).map((_filter: any) => {
            (filter[_filter] = form.getFieldsValue()[_filter])
        })
        setFilter(filter);
        onClose();
    }

    const roomEngagementStatusOptions = [
        { key: "HOT", displayName: "🔥 Hot" },
        { key: "WARM", displayName: "⛅ Warm" },
        { key: "COLD", displayName: "🧊 Cold" },
        { key: "NOT_ENGAGED", displayName: "🚫 Not Engaged" }
    ];

    if (error || uError) return <SomethingWentWrong />

    return(
        <>
            <div className="cm-modal-header cm-flex-align-center cm-flex-space-between">
                <div className='cm-font-size16 cm-font-fam500'>Filters</div>
                    <MaterialSymbolsRounded font="close" size="22" className="cm-cursor-pointer" onClick={onClose}/>
            </div>
            <div className='j-room-filter-form-body cm-padding20'>
                <Form
                    form        =   {form}
                    layout      =   "vertical"
                    onValuesChange    =   {handleValuesChange}
                >
                    {
                        !($isVendorMode || $isVendorOrg) && 
                            <Form.Item
                                name         =   "stage"
                                label        =   {<div className="cm-secondary-text cm-font-size13">Stage</div>}
                                className    =   'cm-light-text'
                                style        =   {{marginBottom: "10px"}}
                                initialValue =   {initialFilter.stage}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    loading             =   {loading}
                                    disabled            =   {loading}
                                    optionFilterProp    =   'filter'
                                    optionLabelProp     =   "label"
                                    placeholder         =   "Choose"
                                    mode                =   "multiple"
                                    listHeight          =   {150}
                                    notFoundContent     =   {
                                        <div style={{height:"50px"}} className='cm-flex-center'>
                                            <div className='cm-empty-text cm-font-size12'>No stage found</div>
                                        </div>
                                    }
                                    suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18'/>}
                                >
                                    {rsData?.roomStages?.map((status: any) => (
                                        <Option key={status.uuid} label = {status.label}>
                                            <Space><Badge color={status?.properties?.color}/>{status.label}</Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                    }
                    <Form.Item
                        name="engagementStatus"
                        label={<div className="cm-secondary-text cm-font-size13">{$dictionary.rooms.singularTitle} Status</div>}
                        className='cm-light-text'
                        style={{ marginBottom: "10px" }}
                        initialValue={initialFilter.engagementStatus}
                    >
                        <Select
                            showSearch
                            allowClear
                            loading={loading}
                            disabled={loading}
                            optionFilterProp='filter'
                            optionLabelProp="label"
                            placeholder="Choose"
                            mode="multiple"
                            listHeight={150}
                            notFoundContent={
                                <div style={{ height: "50px" }} className='cm-flex-center'>
                                    <div className='cm-empty-text cm-font-size12'>No stage found</div>
                                </div>
                            }
                            suffixIcon={<MaterialSymbolsRounded font='expand_more' size='18' />}
                        >
                            {roomEngagementStatusOptions.map((status) => (
                                <Option key={status.key} label={status.displayName}>
                                    {status.displayName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name         =   "template"
                        style        =   {{marginBottom: "10px"}}
                        label        =   {<div className="cm-secondary-text cm-font-size13">{$dictionary.templates.title}</div>}
                        className    =   'cm-light-text'
                        initialValue =   {initialFilter.template}
                    >
                        <Select
                            showSearch
                            allowClear
                            loading             =   {loading}
                            disabled            =   {loading}
                            optionFilterProp    =   'filter'
                            optionLabelProp     =   "label"
                            placeholder         =   "Choose"
                            mode                =   "multiple"
                            listHeight          =   {150}
                            notFoundContent     =   {
                                <div style={{height:"50px"}} className='cm-flex-center'>
                                    <div className='cm-empty-text cm-font-size12'>No {$dictionary.templates.title.toLowerCase()} found</div>
                                </div>
                            }
                            suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18'/>}
                        >
                            {data && data.roomTemplates.map((_template: any) => (
                                <Option value={_template.uuid} label = {<div className="cm-font-fam500 cm-font-size14">{_template.title}</div>}>
                                    <Space direction="vertical" size={2}>
                                        <div className="cm-font-fam500 cm-font-size13">{_template.title}</div>
                                        {
                                            _template.description ?
                                                <div className="cm-font-fam300 cm-font-size12">{_template.description}</div>
                                            :
                                                <div className="cm-font-fam300 cm-font-size12 cm-empty-text">No description found</div>
                                        }
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name         =   "createdBy"
                        style        =   {{marginBottom: "10px"}}
                        label        =   {<div className="cm-secondary-text cm-font-size13">Created By</div>}
                        className    =   'cm-light-text'
                        initialValue =   {initialFilter.createdBy}
                    >
                        <Select
                            showSearch
                            allowClear
                            loading             =   {uLoading}
                            disabled            =   {uLoading}
                            optionFilterProp    =   'filter'
                            optionLabelProp     =   "label"
                            placeholder         =   "Choose"
                            mode                =   "multiple"
                            listHeight          =   {150}
                            suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18' />}
                            notFoundContent={
                                <div style={{ height: "50px" }} className='cm-flex-center'>
                                    <div className='cm-empty-text cm-font-size12'>No users found</div>
                                </div>
                            }
                        >
                            {uData && uData.users.map((_user: any) => (
                                <Option filter={CommonUtil.__getFullName(_user.firstName, _user.lastName)} value={_user.uuid} label = {<div className="cm-font-fam500 cm-font-size14">{CommonUtil.__getFullName(_user.firstName, _user.lastName)}</div>}>
                                   <Space>
                                        <Avatar size={30} shape='square' style = {{backgroundColor: "#ededed", color: "#000", borderRadius: "6px" }} src={_user.profileUrl ? <img src={_user.profileUrl} alt={CommonUtil.__getFullName(_user.firstName, _user.lastName)}/> : ""}>
                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_user.firstName, _user.lastName),1)}
                                        </Avatar>
                                        <Text ellipsis={{ tooltip: CommonUtil.__getFullName(_user.firstName, _user.lastName) }} className="cm-font-fam500">{CommonUtil.__getFullName(_user.firstName, _user.lastName)}</Text>
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name        =   "region"
                        style       =   {{ marginBottom: "10px" }}
                        label       =   {<div className="cm-secondary-text cm-font-fam500 cm-font-size13">Region</div>}
                        initialValue=   {initialFilter.region}
                    >
                        <Select
                            showSearch
                            allowClear
                            optionFilterProp    =   'label'
                            optionLabelProp     =   "label"
                            placeholder         =   "Choose"
                            mode                =   "multiple"
                            listHeight          =   {150}
                            suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18' />}
                        >
                            {regionsData?.regions.map((region: any) => (
                                <Option
                                    key     =   {region.uuid}
                                    value   =   {region.uuid}
                                    label   =   {region.name}
                                >
                                    <Text ellipsis={{ tooltip: region.name }} className="cm-font-fam500">
                                        {region.name}
                                    </Text>
                                </Option>
                            ))}

                        </Select>
                    </Form.Item>

                    <Form.Item
                        name        =   "language"
                        style       =   {{marginBottom: "10px"}}
                        label       =   {<div className="cm-secondary-text cm-font-fam500 cm-font-size13">Language</div>}
                        initialValue =   {initialFilter.language}
                    >
                        <Select
                            allowClear
                            optionLabelProp     =   "label"
                            placeholder         =   "Choose"
                            mode                =   "multiple"
                            listHeight          =   {150}
                            suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18'/>}
                        >
                            {Object.values(languages).map((_lang: any) => (
                                <Option key={_lang.key} label={_lang.label}>
                                    {_lang.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name        =   "discoveryEnabled"
                        style       =   {{ marginBottom: "10px" }}
                        label       =   {<div className="cm-secondary-text cm-font-fam500 cm-font-size13">Discovery</div>}
                        initialValue=   {initialFilter.discoveryEnabled}
                    >
                        <Select
                            allowClear
                            optionLabelProp =   "label"
                            placeholder     =   "Choose"
                            listHeight      =   {150}
                            suffixIcon      =   {<MaterialSymbolsRounded font='expand_more' size='18' />}
                        >
                            {Object.values(discovery).map((_discovery: any) => (
                                <Option key={_discovery.key} label={_discovery.label}>
                                    <div>{_discovery.label}</div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className="j-add-res-form-footer cm-flex-space-between">
                <div>
                    {
                        isFilterApplied() ?
                            <Button type='link' className="cm-flex-center cm-font-size13 cm-text-decoration-underline" onClick={handleReset} size="large">
                                Reset Filter
                            </Button>
                        :
                            null
                    }
                </div>
                <div>
                    <Space>
                        <Form.Item noStyle>
                            <Button ghost type='primary' className="cm-flex-center" htmlType="submit" onClick={onClose}>
                                Cancel
                            </Button>
                        </Form.Item>
                        <Form.Item noStyle>
                            <Button type='primary' className={`cm-flex-center ${isButtonDisabled ? "cm-button-disabled" : ""}`} htmlType="submit" onClick={applyFilter} disabled={isButtonDisabled}>
                                Apply
                            </Button>
                        </Form.Item>
                    </Space>
                </div>
            </div>
        </>
    )
}

export default RoomFilterForm


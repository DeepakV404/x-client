import { useContext, useState } from 'react';
import { Avatar, Button, Checkbox, Collapse, Form, Input, Radio, Select, Space, Switch, Typography, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { debounce } from "lodash";

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, Length_Input, LINKED_IN_URL_REGEX, MODULE_TEMPLATE, WIDGET_PROFILE_IMAGE_FALLBACK } from '../../../../../../constants/module-constants';
import { RoomTemplateAgent } from '../../../../../templates/api/room-template-agent';
import { WidgetsAgent } from '../../../../../custom-sections/api/widgets-agent';
import { CommonUtil } from '../../../../../../utils/common-util';
import { GlobalContext } from '../../../../../../globals';

import MaterialSymbolsRounded from '../../../../../../components/MaterialSymbolsRounded';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import { RoomsAgent } from '../../../../api/rooms-agent';

const { Text }      =   Typography;
const { Option }    =   Select;
const { useForm }   =   Form;

export const PROFILE_TYPE_USER      =   "PROFILE_TYPE_USER";
export const PROFILE_TYPE_CUSTOM    =   "PROFILE_TYPE_CUSTOM";

const EditPersonComponent = (props: { component: any, widget: any, module: any }) => {

    const { component, widget, module } =   props;

    const [form]           =   useForm();
    const { $sellers }     =   useContext(GlobalContext);

    const __isTeamUser  =   component.content?.teamCard?.teamUser;
    const __profileUrl  =   component.content?.profileImage?.url;
    const __userUuid    =   component.content?.teamCard?.userUuid ? component.content?.teamCard?.userUuid : undefined;

    const __buttonPropertyMap           =   {...component.content.button};
    const __namePropertyMap             =   {...component.content.name};
    const __designationPropertyMap      =   {...component.content.designation};
    const __linkedInButtonPropertyMap   =   {...component.content.linkedInButton};
    const __profileImagePropertyMap     =   {...component.content.profileImage};
    const __teamCardPropertyMap         =   {...component.content.teamCard};

    const [profileType, setProfileType]             =   useState(__isTeamUser ? PROFILE_TYPE_USER : PROFILE_TYPE_CUSTOM);
    const [profileUrl, setProfileUrl]               =   useState<string | null | undefined>(__profileUrl);

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        setProfileType(PROFILE_TYPE_CUSTOM)
        form.setFieldsValue({
            ["existingProfile"] : undefined
        })
        getBase64(info.file as RcFile, (url) => {
            setProfileUrl(url);
        });

        WidgetsAgent.updateWidgetProfileImageNoRefetch({
            variables: {
                widgetUuid      :   widget.uuid,
                componentUuid   :   component.uuid,
                profileImage    :   info?.file
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    };

    const onTypeChange = (event: any) => {
        setProfileType(event.target.value);
        if(event.target.value === PROFILE_TYPE_CUSTOM){
            form.setFieldsValue({
                ["existingProfile"] : undefined
            })
            __teamCardPropertyMap["teamUser"]     =   false;
            if(module === MODULE_TEMPLATE){
                RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                    variables: {
                        componentUuid   :   component.uuid,
                        widgetUuid      :   widget.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   __teamCardPropertyMap
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {},
                });
            }else{
                RoomsAgent.updateComponentByPropertyNoRefetch({
                    variables: {
                        componentUuid   :   component.uuid,
                        widgetUuid      :   widget.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   __teamCardPropertyMap
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {},
                });
            }
        }
    }

    const handleTeamUserSelect = (selectedId: any) => {
        if(selectedId){
            __teamCardPropertyMap["teamUser"]     =   true;
            __teamCardPropertyMap["userUuid"]     =   selectedId;
            if(module === MODULE_TEMPLATE){
                RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                    variables: {
                        componentUuid   :   component.uuid,
                        widgetUuid      :   widget.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   __teamCardPropertyMap
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {},
                });
            }
            else{
                RoomsAgent.updateComponentByPropertyNoRefetch({
                    variables: {
                        componentUuid   :   component.uuid,
                        widgetUuid      :   widget.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   __teamCardPropertyMap
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {},
                });
            }
        }
    }

    const handlePersonNameChange = debounce((event: any) => {
        handleNameChange(event.target.value);
    }, 500);

    const handleNameChange = (name: string) => {
        __namePropertyMap["value"]  =   name
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "name",
                    propertyContent :   __namePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "name",
                    propertyContent :   __namePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const handlePersonDesignationChange = debounce((event: any) => {
        handleDesignationChange(event.target.value);
    }, 500);

    const handleDesignationChange = (designation: string) => {
        __designationPropertyMap["value"]  =   designation
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "designation",
                    propertyContent :   __designationPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "designation",
                    propertyContent :   __designationPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const handlePersonLinkedInChange = debounce((event: any) => {
        handleLinkedInChange(event.target.value);
    }, 500);

    const handleLinkedInChange = (url: string) => {
        if(LINKED_IN_URL_REGEX.test(url)){
            __linkedInButtonPropertyMap["link"]  =   url
            if(module === MODULE_TEMPLATE){
                RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                    variables: {
                        componentUuid   :   component.uuid,
                        widgetUuid      :   widget.uuid,
                        propertyKey     :   "linkedInButton",
                        propertyContent :   __linkedInButtonPropertyMap
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {},
                });
            }else{
                RoomsAgent.updateComponentByPropertyNoRefetch({
                    variables: {
                        componentUuid   :   component.uuid,
                        widgetUuid      :   widget.uuid,
                        propertyKey     :   "linkedInButton",
                        propertyContent :   __linkedInButtonPropertyMap
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {},
                });
            }
        }
    }

    const handlePersonButtonChange = debounce(() => {
        handleButtonChange();
    }, 500);

    const handleButtonChange = () => {
        __buttonPropertyMap["link"]             =   form.getFieldValue("buttonLink");
        __buttonPropertyMap["name"]             =   form.getFieldValue("buttonName");
        __buttonPropertyMap["openInNewTab"]     =   form.getFieldValue("openInNewTab");

        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }    

    const changeDesignationState = (state: boolean) => {
        __designationPropertyMap["enabled"]  =   state
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "designation",
                    propertyContent :   __designationPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "designation",
                    propertyContent :   __designationPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const changeButtonState = (state: boolean) => {
        __buttonPropertyMap["enabled"]  =   state
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const changeLinkedInButtonState = (state: boolean) => {
        __linkedInButtonPropertyMap["enabled"]  =   state
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "linkedInButton",
                    propertyContent :   __linkedInButtonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "linkedInButton",
                    propertyContent :   __linkedInButtonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    let sellersList = $sellers.filter((_seller: any) => _seller.status !== "DELETED")

    return (
        <Form form={form} className="cm-form cm-width100" layout='vertical'>
            <Space direction='vertical' className='cm-width100' size={10}>
                <div className='cm-padding15 j-team-card-person-edit-wrapper'>
                    <Radio.Group onChange={onTypeChange} value={profileType} className="cm-width100">
                        <Space direction="vertical" size={20} className="cm-width100">
                            <Space direction="vertical" size={15}>
                                <Radio value={PROFILE_TYPE_USER} className="j-choose-profile-radio-wrapper">
                                    <Space direction="vertical" size={0}>
                                        <div className="cm-font-fam600 cm-font-size15 cm-font-opacity-black-85">Choose your teammate</div>
                                        <div className="cm-font-size13 cm-font-opacity-black-65">You cannot modify the personal data by choosing this option</div>
                                    </Space>
                                </Radio>
                                <Form.Item 
                                    name        =   {"existingProfile"} 
                                    style       =   {{paddingLeft: "24px"}} 
                                    initialValue=   {__isTeamUser ? __userUuid : undefined}
                                    rules       =   {[{required: profileType === PROFILE_TYPE_USER ? true : false, message: "Select an user"}]}
                                >
                                    <Select 
                                        placeholder     =   {"Select User"} 
                                        optionLabelProp =   "label" 
                                        optionFilterProp=   "label" 
                                        onChange        =   {(selectedId: any, selectedChild: any) => {handleTeamUserSelect(selectedId); setProfileUrl(selectedChild.profileUrl); setProfileType(PROFILE_TYPE_USER)}}
                                        showSearch 
                                        allowClear 
                                    >
                                        {
                                            sellersList.map((_seller: any) => (
                                                <Option key={_seller.uuid} label={CommonUtil.__getFullName(_seller.firstName, _seller.lastName)} profileUrl={_seller.profileUrl}>
                                                    <Space>
                                                        <Avatar shape="square" size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "30px" }} src={_seller.profileUrl ? <img src={_seller.profileUrl} alt={CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}/> : ""}>
                                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_seller.firstName, _seller.lastName), 1)}
                                                        </Avatar>
                                                        {CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}
                                                    </Space>
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Space>
                            <Space direction="vertical" className="cm-width100" size={20}>
                                <Radio value={PROFILE_TYPE_CUSTOM} className="j-choose-profile-radio-wrapper">
                                    <Space direction="vertical" size={0}>
                                        <div className="cm-font-fam600 cm-font-size15 cm-font-opacity-black-85">Custom Contact Card</div>
                                        <div className="cm-font-size13 cm-font-opacity-black-65">You can modify all the data</div>
                                    </Space>
                                </Radio>
                            </Space>
                        </Space>
                    </Radio.Group>
                </div>
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        collapsible     =   {profileType === PROFILE_TYPE_USER ? "disabled" : undefined} 
                        className       =   'j-team-card-edit-property-wrapper' 
                        key             =   {"profile"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Profile Picture 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__profileImagePropertyMap.enabled} 
                                        disabled        =   {__profileImagePropertyMap.required} 
                                        onChange        =   {(_: boolean, event: any) => event.stopPropagation()}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        {
                            profileUrl 
                            ?
                                <Space>
                                    <div className="cm-flex-center j-hyperlink-text cm-font-fam500 cm-border-radius6" style={{ height: "150px", width: "150px" }} >
                                        {profileUrl ? <img height={"100%"} width={"100%"} src={profileUrl} className="cm-object-fit-cover cm-border-radius12" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= WIDGET_PROFILE_IMAGE_FALLBACK}}/> : WIDGET_PROFILE_IMAGE_FALLBACK}
                                    </div>
                                    <Form.Item name="customProfile" rules={[{required: profileType === PROFILE_TYPE_CUSTOM ? true : false, message: "Upload an image"}]}>
                                        <Upload listType="picture" beforeUpload={()=> {return false}} onChange={handleChange} disabled={false} accept={ACCEPTED_PROFILE_IMAGE_FILE_TYPES} maxCount={1} showUploadList={false}>
                                            <Button className='cm-icon-button' icon={<MaterialSymbolsRounded font='upload_2' size='18'/>}>from Device</Button>
                                        </Upload>
                                    </Form.Item>
                                </Space>
                            :
                                <Form.Item name="customProfile" rules={[{required: profileType === PROFILE_TYPE_CUSTOM ? true : false, message: "Upload an image"}]}>
                                    <Upload listType="picture" className="j-upload-option-wrapper" beforeUpload={()=> {return false}} onChange={handleChange} disabled={false} accept={ACCEPTED_PROFILE_IMAGE_FILE_TYPES} maxCount={1} showUploadList={false}>
                                        <div className="j-section-resource-add-card cm-flex-center cm-cursor-pointer j-hyperlink-text cm-font-fam500 cm-border-radius6" style={{ height: "170px", width: "170px" }} >
                                            Upload / Choose
                                        </div>
                                    </Upload>
                                </Form.Item>
                        }
                    </CollapsePanel>
                </Collapse>
                <Collapse
                    expandIcon      =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        collapsible     =   {profileType === PROFILE_TYPE_USER ? "disabled" : undefined} 
                        className       =   'j-team-card-edit-property-wrapper' 
                        key             =   {"name"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Person Name 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch size='small' defaultValue={__namePropertyMap.enabled} disabled={__namePropertyMap.required} onChange={(_: boolean, event: any) => event.stopPropagation()}/>
                                </div>
                            </div>
                        } 
                    >
                        <Form.Item name={"name"} noStyle={true} initialValue={__namePropertyMap.value}>
                            <Input placeholder="Name" onChange={handlePersonNameChange} disabled={profileType === PROFILE_TYPE_USER}/>
                        </Form.Item>
                    </CollapsePanel>
                </Collapse>
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        collapsible     =   {profileType === PROFILE_TYPE_USER ? "disabled" : undefined} 
                        className       =   'j-team-card-edit-property-wrapper' 
                        key             =   {"designation"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Designation 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__designationPropertyMap.enabled} 
                                        disabled        =   {__designationPropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {
                                            event.stopPropagation()
                                            changeDesignationState(state)
                                        }}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <Form.Item name={"designation"} noStyle={true} initialValue={__designationPropertyMap.value}>
                            <Input placeholder="Designation" onChange={handlePersonDesignationChange} disabled={profileType === PROFILE_TYPE_USER}/>
                        </Form.Item>
                    </CollapsePanel>
                </Collapse>
                {/* Button Property */}
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-team-card-edit-property-wrapper' 
                        key             =   {"button"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Button 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__buttonPropertyMap.enabled} 
                                        disabled        =   {__buttonPropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {
                                            event.stopPropagation()
                                            changeButtonState(state)
                                        }}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <>
                            <Form.Item label="Name" name="buttonName"
                                rules       =   {[{
                                    required    :   true,
                                    message     :   "Name is required"
                                }]}
                                initialValue=   {__buttonPropertyMap.name}
                            >
                                <Input allowClear maxLength={Length_Input} placeholder="Name" size="large" onChange={handlePersonButtonChange}/>
                            </Form.Item>
                            <Form.Item label="Link" name="buttonLink"
                                rules           =   {[
                                    {
                                        required    :   true,
                                        message     :   "Link required",
                                    }
                                ]}
                                initialValue    =   {__buttonPropertyMap.link}
                            >
                                <Input allowClear maxLength={Length_Input} placeholder="Link" size="large" onChange={handlePersonButtonChange}/>
                            </Form.Item>
                            <Form.Item noStyle name={"openInNewTab"} valuePropName="checked" initialValue={__buttonPropertyMap.openInNewTab}>
                                <Checkbox
                                    onChange    =   {handleButtonChange}
                                    onClick     =   {(event) => event.stopPropagation()}
                                >
                                    <Text>Open in new tab</Text>
                                </Checkbox>
                            </Form.Item>
                        </>
                    </CollapsePanel>
                </Collapse>
                {/* Button Property */}
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        collapsible     =   {profileType === PROFILE_TYPE_USER ? "disabled" : undefined} 
                        className       =   'j-team-card-edit-property-wrapper' 
                        key             =   {"linkedIn"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                LinkedIn 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__linkedInButtonPropertyMap.enabled} 
                                        disabled        =   {__linkedInButtonPropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {
                                            event.stopPropagation()
                                            changeLinkedInButtonState(state)
                                        }}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <Form.Item label="Link" name={"link"}
                            rules       =   {[{
                                required    :   true,
                                message     :   "Link required"
                            },{
                                pattern     :   LINKED_IN_URL_REGEX,
                                message     :   "Not an valid link"
                            }]}
                            initialValue=   {__linkedInButtonPropertyMap.link}
                        >
                            <Input allowClear maxLength={Length_Input} placeholder="Link" size="large" disabled={profileType === PROFILE_TYPE_USER} onChange={handlePersonLinkedInChange}/>
                        </Form.Item>
                    </CollapsePanel>
                </Collapse>
            </Space>
        </Form>
    )
}

export default EditPersonComponent
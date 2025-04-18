import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, DatePicker, Divider, Form, Input, Select, Space, Tooltip, Typography } from 'antd';

import { LibraryAgent } from '../../api/library-agent';
import { CommonUtil } from '../../../../utils/common-util';
import { ERROR_CONFIG } from '../../../../config/error-config';

import CustomFormSubmitButton from '../../../../components/custom-submit-button/custom-form-submit-button';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../../rooms/library/library-modal/library-modal';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { D_TAGS } from '../../api/library-query';

const { useForm }   =   Form;
const { Text }      =   Typography;
const { Option }    =   Select

const colors = [
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
    "magenta",
    "red"
];

const getRandomColor = () => {
    return colors[(Math.floor(Math.random() * colors.length))];
}

const CreateDeckForm = (props: {onClose: any, resources?: any, action: any, deckCreatedInResources?: boolean}) => {

    const { onClose, resources, action } = props;

    const [form]    =   useForm();
    const navigate  =   useNavigate()

    const [showLibraryModal, setShowLibraryModal]   =   useState<boolean>(false);
    const [selectedResources, setSelectedResources] =   useState<any>(resources || []);
    const [expiryChecked, setExpiryChecked]         =   useState(false);
    const [submitState, setSubmitState]             =   useState({
        loading :   false,
        text    :   "Create",
    })

    const { data: tagsData }  =   useQuery(D_TAGS, {
        fetchPolicy: "network-only"
    });
    
    const inputRef = useRef<any>(null)

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    }, [])

    const handleAddResourceClick = () => {
        setShowLibraryModal(true)
    }

    const handleSelectResource = (resources: any) => {        
        setSelectedResources((prevResources: any) => {
            let notPresentResources = resources.filter((_resource: any) => !prevResources.some((_prevResource: any)=> _prevResource.uuid === _resource.uuid))
            let newResources = [...prevResources, ...notPresentResources]
            return newResources
        })
        setShowLibraryModal(false)
    }

    const handleDelete = (resource: any) => {
        setSelectedResources((prevResources: any) => {
            return prevResources.filter((_prevResource: any) => _prevResource.uuid !== resource.uuid)
        })
    }

    const onFinish = (values: any) => {  
        const tags = values?.tags ? [...values.tags] : [];

        const generateUuidObject = (item: any) => {
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (uuidPattern.test(item)) {
                return item; 
            } else {
                return {
                    uuid: crypto.randomUUID(), 
                    name: item,
                    properties: {
                        colorCode: getRandomColor(),
                    }
                };
            }
        };

        const transformedTags = tags.map(generateUuidObject);        
        if(transformedTags.length) {
            LibraryAgent._dCreateTags({
                variables: {
                    inputs: transformedTags.map(tag => (typeof tag === "object" ? tag : null)).filter(tag => tag !== null),
                },
                onCompletion: () => {
                    
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(
                        ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error
                    );
                },
            });
        }
            
        setSubmitState({
            loading: true,
            text: "Creating"
        })

        const resourceInputs = selectedResources.map((resource: any) => ({
            libraryResource  :  {
                uuid: resource.uuid,
                pages: resource.pages ?? undefined,
            }
        }));

        LibraryAgent.addDeck({
            variables: {
               input    :   {
                    title               :   values.title,
                    type                :   values.linkAccess,
                    resourceInputs      :   resourceInputs,
                    enableLink          :   true,
                    tagUuids            :   transformedTags.map((tag) => tag.uuid ?? tag),
                    settings            : {
                        allowDownloads  : values.allowDownload,
                        expirationDate  : values.expirationDate ? dayjs(values.expirationDate).valueOf() : null,
                    }
                },
            },
            onCompletion: (data: any) => {
                setSubmitState({
                    loading: false,
                    text: "Create"
                })
                onClose()
                navigate(`/links/${data?.createDeck.uuid}`)
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const disabledDate = (current: any) => {
        const currentDate = dayjs();        
        return current && current < currentDate.startOf('day');
    }

    return (
        <>
            <Space className="cm-flex-space-between cm-padding15">
                <span className="cm-font-size16 cm-font-fam500">{action} Link</span>
                <MaterialSymbolsRounded font="close" className="cm-cursor-pointer" onClick={onClose}/>
            </Space>
            <Divider style={{margin: "0px"}}/>
            <Form
                form        =   {form} 
                layout      =   'vertical' 
                className   =   'cm-form cm-padding15 cm-overflow-auto'
                onFinish    =   {onFinish}
                style       =   {{height: "calc(100% - 116px)"}}
            >
                <Form.Item name={"title"} label={<div className='cm-font-opacity-black-85'>Title</div>} rules={[{required: true, message: "Enter a title for your link"}]}>
                    <Input placeholder='Eg: Marketing Collateral' size='large' ref={inputRef} autoFocus/>
                </Form.Item>
                <Form.Item name={"tags"} label={<div className='cm-font-opacity-black-85'>Tags</div>}>
                    <Select
                        showSearch
                        placeholder="Add tags or type to create an new one"
                        optionFilterProp="children"
                        options={tagsData?._dTags?.map((tag: any) => ({
                            value: tag.uuid,
                            label: tag.name,
                            children: tag.name
                        }))}
                        size='large'
                        mode='tags'
                    />
                </Form.Item>
                <div className='cm-font-opacity-black-85 cm-font-size13 cm-padding-bottom10'>{selectedResources.length > 0 ? `Resources (${selectedResources.length})` : null}</div>
                <Space direction='vertical' className='cm-width100 cm-margin-bottom20'>
                    {
                        selectedResources.length > 0 ?
                            selectedResources.map((_resource: any) => (
                                <div key={_resource.uuid} className='cm-border-radius6 cm-padding15' style={{border: "1px solid #d9d9d9"}}>
                                    <Space className='cm-flex-space-between'>
                                        <div className='cm-flex-align-center' style={{columnGap: "20px"}}>
                                            <div style={{width: "80px", height: "45px", border: "1px solid #d9d9d93b"}} className='cm-flex-center cm-border-radius4'>
                                                <img className='cm-width100 cm-height100 cm-border-radius4 cm-object-fit-scale-down' src={_resource?.content?.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage(_resource.content.type)}/>
                                            </div>
                                            <Text className='cm-font-fam500' style={{maxWidth: "380px"}} ellipsis={{tooltip: _resource.title}}>{_resource.title}</Text>
                                        </div>
                                        <MaterialSymbolsRounded font='delete' size='20' className='cm-cursor-pointer' onClick={() => handleDelete(_resource)}/>
                                    </Space>
                                </div>
                            ))
                        :
                            null
                        }
                </Space>
                <Button block type='primary' ghost onClick={handleAddResourceClick} size='large' className='cm-font-size14'>Add Resources</Button>
                <Space direction='vertical' className='cm-width100 cm-margin-top20'>
                    <Text className='cm-font-fam500'>Manage Link Access</Text>
                    <Space size={4}>
                        <div className='cm-font-opacity-black-85 cm-font-size13'>Who can access</div>
                        <Tooltip title={<span>The link will remain the same even if room sharing permissions are changed.</span>}>
                            <div><MaterialSymbolsRounded font='info' size='16' className='cm-cursor-pointer'/></div>
                        </Tooltip>
                    </Space>
                    <Form.Item name="linkAccess" initialValue="PUBLIC">
                        <Select
                            suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                            style               =   {{width: "100%"}}
                            optionLabelProp     =   "label"
                            defaultValue        =   {"PUBLIC"}
                            onChange            =   {(value) => {form.setFieldsValue({ linkAccess: value })}}
                        >
                            <Option
                                key     =   {"PUBLIC"}
                                label   =   {
                                    <Space className='cm-flex-align-center'>
                                        <MaterialSymbolsRounded font="language" size='18'color='#000000a6'/>
                                        Anyone with this link
                                    </Space>
                                }
                            >
                                <div className="cm-flex-align-center" style={{height: "45px"}}>
                                    <Space className='cm-flex-align-start'>
                                        <MaterialSymbolsRounded font="language" size='20' color='#000000a6'/>
                                        <Space direction='vertical' size={0}>
                                            Anyone with this link
                                            <div className='cm-font-size12 cm-font-opacity-black-65'>Anyone can enter the room without restriction</div>
                                        </Space>
                                    </Space>
                                </div>
                            </Option>
                            <Option
                                key     =   {"EMAIL_PROTECTED"}
                                label   =   {
                                    <Space className='cm-flex-align-center'>
                                        <MaterialSymbolsRounded font="alternate_email" size='18' color='#000000a6'/>
                                        Require email address
                                    </Space>
                                }
                            >
                                <div className="cm-flex-align-center" style={{height: "45px"}}>
                                    <Space className='cm-flex-align-start cm-width100'>
                                        <MaterialSymbolsRounded font="alternate_email" size='20' color='#000000a6'/>
                                        <Space direction='vertical' size={0}>
                                            Require email address
                                            <div className='cm-font-size12 cm-font-opacity-black-65'>Viewer must enter the mail id to access the link</div>
                                        </Space>
                                    </Space>
                                </div>
                            </Option>
                            <Option
                                key     =   {"OTP_PROTECTED"}
                                label   =   {
                                    <Space className='cm-flex-align-center'>
                                        <MaterialSymbolsRounded font="lock" size='18' color='#000000a6'/>
                                        Protected
                                    </Space>
                                }
                            >
                                <div className="cm-flex-align-center" style={{height: "45px"}}>
                                    <Space className='cm-flex-align-start cm-width100'>
                                        <MaterialSymbolsRounded font="lock" size='20' color='#000000a6'/>
                                        <Space direction='vertical' size={0}>
                                            Protected
                                            <div className='cm-font-size12 cm-font-opacity-black-65'>Only invited people can access with email verification</div>
                                        </Space>
                                    </Space>
                                </div>
                            </Option>
                        </Select>
                    </Form.Item>
                </Space>
                <div className='cm-margin-top20 cm-margin-bottom10 cm-font-fam500 cm-font-opacity-black-85'>Link Settings</div>
                <Form.Item name="allowDownload" valuePropName="checked">
                    <Checkbox onChange={(e) => {form.setFieldsValue({ allowDownload: e.target.checked })}} className='cm-flex-align-center'><Space className='cm-margin-left5 cm-flex-center'>Allow Download</Space></Checkbox>
                </Form.Item>
                <Form.Item name="expiryChecked" valuePropName="checked">
                    <Checkbox className='cm-flex-align-center' onChange={(e) => {form.setFieldsValue({ expiryChecked: e.target.checked }); setExpiryChecked((prev) => !prev)}}><Space className='cm-margin-left5 cm-flex-center'>Set Expiry Date</Space></Checkbox>
                </Form.Item>
                {
                    expiryChecked && (
                        <Form.Item name="expirationDate" rules={[{ required: true, message: "Please select an expiry date" }]}>
                            <DatePicker style={{ width: "200px"}} placeholder="Select Expiry Date" disabledDate={disabledDate} className="cm-cursor-pointer cm-margin-left25" allowClear={true} suffixIcon={<MaterialSymbolsRounded font="calendar_month" size="18" color="#000" />} />
                        </Form.Item>
                    )
                }
            </Form>
            <div className='j-demo-form-footer'>
                <Space>
                    <Button className="cm-cancel-btn" ghost onClick={() => onClose()}><div className="cm-font-size14 cm-secondary-text">Cancel</div></Button>
                    <CustomFormSubmitButton form={form} submitState={submitState}/>
                </Space>
            </div>

            <LibraryModal
                isOpen                  =   {showLibraryModal}
                resourceViewMode        =   {"list_view"}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resources: any) => handleSelectResource(resources)}   
                initialFilter           =   {[]}
                pdfCustomPageSelection  =   {{isPDFSelection: true, module: "deck"}}
                multipleResource
            />
        </>
    )
}

export default CreateDeckForm
import { useContext, useState } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { useLazyQuery } from '@apollo/client';
import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, Length_Input } from "../../../constants/module-constants";
import { PASTE_LINK, UPLOAD_FROM_DEVICE } from "../../templates/template-view/template-edit-resource";
import { RESOURCE_TYPE_CONFIG } from "../config/resource-type-config";
import { ERROR_CONFIG } from "../../../config/error-config";
import { GET_LINK_META_DATA } from "../api/library-query";
import { CommonUtil } from "../../../utils/common-util";
import { LibraryAgent } from "../api/library-agent";
import { GlobalContext } from "../../../globals";

import DemoEditEmptyCard from "../../rooms/room-settings/demo-edit/demo-edit-empty-card";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { useForm }           =   Form;
const { Dragger }           =   Upload;
const { Option }            =   Select;

const EditResourceForm = (props: { resource: any, onClose: () => void; }) => {

    const { resource, onClose }  =   props; 
    
    const [form]    =   useForm();

    const { $categories }   =   useContext(GlobalContext);

    const [initialData, setInitialData]             =   useState(resource);

    const [imageUrl, setImageUrl]                   =   useState<string>(resource?.content?.thumbnailUrl);
    const [currentUploadType, setCurrentUploadType] =   useState(PASTE_LINK);

    const [updatedFile, setUpdatedFile]             =   useState<any>(null);
    const [pastedLink, setPastedLink]               =   useState<any>();
    const [submitState, setSubmitState]   =   useState({
        text    :   "Update",
        loading :   false
    })

    const [_getMetaData, { data, loading }]         =   useLazyQuery(GET_LINK_META_DATA, {
        fetchPolicy: "network-only"
    });

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        getBase64(info.file.originFileObj as RcFile, (url) => {
            setImageUrl(url);
        });
    };

    const resetAll = () => {
        setUpdatedFile(null)
        setPastedLink(null)
        setInitialData(null)
    }

    const handleUploadOptionChange = (_selectedKey: string) => {
        setCurrentUploadType(_selectedKey)
        resetAll()
    }
    
    const handleFileUpload = (_file: any) => {
        setUpdatedFile(_file.file)
    }

    let timeout: any;
    const debounce = function (func: any, delay: any) {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };

    const handlePasteLinkChange = (event: any) => {
        setPastedLink(event.target.value)
        if(event.target.value.trim()){
            debounce(() => {
                _getMetaData({
                    variables: {
                        link : event.target.value.trim()
                    }
                })
            }, 1000)
        }
    }

    const handleRemoveContent = () => {
        setInitialData(null)
    }

    const onFinish = (values: any) => {

        setSubmitState({
            loading: true,
            text    :   "Updating"
        })

        let input: any = {
            resourceUuid    :   resource.uuid,
            title           :   values.title,
            categories      :   values.categories,
        }

        if(updatedFile && currentUploadType === UPLOAD_FROM_DEVICE){
            input["content"]    =   updatedFile;
        }else{
            input["url"]        =   pastedLink;
            input["urlType"]    =   'link';
        }

        if(imageUrl && values.thumbnailUrl.file){
            input["thumbnailImage"]   =   values.thumbnailUrl.file
        }

        const title = form.getFieldsValue().title;

        if(!title.trim()){
            CommonUtil.__showError("Resource title cannot be empty");
            return;
        }

        LibraryAgent.updateResourceInfo({
            variables: input,
            onCompletion: () => {
                setSubmitState({
                    loading: false,
                    text    :   "Update"
                })        
                onClose()
                CommonUtil.__showSuccess("Resource updated successfully")
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    loading : false,
                    text    :   "Update"
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const getUploadComponent = () => {
        if(initialData){
            return <DemoEditEmptyCard title={initialData.title} imgSource={initialData.content.thumbnailUrl ? initialData.content.thumbnailUrl : RESOURCE_TYPE_CONFIG[initialData.type].imageFile} handleRemove={() => handleRemoveContent()}/>
        }else{
            switch (currentUploadType){
                case PASTE_LINK:
                    return (
                        <Space direction='vertical' className='cm-width100'>
                            <Space className='cm-width100 cm-space-inherit' direction='vertical'>
                                <div className='cm-flex-center cm-font-fam500 cm-font-size16'>Paste a Link</div>
                                <Input size='large' placeholder='Paste a link' onChange={handlePasteLinkChange} prefix={<MaterialSymbolsRounded font='link' size='20' className='cm-margin-right5'/>}/>
                            </Space>
                                {
                                    pastedLink && !loading && data ?
                                        <DemoEditEmptyCard title={data._pGetLinkMetadata.ogTitle} imgSource={data._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : CommonUtil.__getResourceFallbackImage("video")} handleRemove={() => setPastedLink(null)}/>
                                    :
                                        <DemoEditEmptyCard/>
                                }
                            </Space>
                    )

                case UPLOAD_FROM_DEVICE:
                    return (
                        <Space direction='vertical' className='cm-width100'>
                            <Dragger className='j-demo-file-dragger' beforeUpload={() => {return false}} showUploadList={false} onChange={handleFileUpload}>
                                <Space direction='vertical'>
                                    <Button>Choose File</Button>
                                    <div className='cm-font-size12'>Click or drag file to this area to upload</div>
                                </Space>
                            </Dragger>
                            {
                                updatedFile ? 
                                    <DemoEditEmptyCard title={updatedFile.name} imgSource={CommonUtil.__getResourceFallbackImage(updatedFile.type)} handleRemove={() => setUpdatedFile(null)}/>
                                :
                                    <DemoEditEmptyCard />
                            }
                        </Space>
                    )
            }
        }
    }  

    return (
        <>
            <div className='j-demo-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Edit Resource
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <Form className="cm-form cm-form j-edit-resource-drawer-content j-demo-form-body" layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item name="title" rules={[{required: true, message: "Add a title", whitespace: true}]} initialValue={resource.title} label={"Title"} className="cm-width100">
                    <Input size="large" maxLength={Length_Input} allowClear placeholder={"Add a title"}/>    
                </Form.Item>
                <Form.Item name={"categories"} label={"Categories"} className="cm-width100 cm-margin0" initialValue={resource.categories.map((_item: any) => _item.uuid)}>
                    <Select 
                        showSearch
                        allowClear
                        optionFilterProp    =   "children"
                        className           =   "cm-width100 cm-select" 
                        placeholder         =   "Select category" 
                        mode                =   'multiple'
                        maxTagCount         =   {3}
                        maxTagPlaceholder   =   {(omittedValues) => `+${omittedValues.length} more`}
                        suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                    >
                        {$categories?.map((_category: any) => (
                            <Option value={_category.uuid} key={_category.uuid} >{_category.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <div className="cm-position-relative">
                    {/* {imageUrl && <div className="cm-link-text cm-position-absolute cm-thumbnail-remove-cta" onClick={removeResourceThumbnail}>Remove thumbnail</div>}*/}
                    <Form.Item name={"thumbnailUrl"} initialValue={imageUrl} label={"Thumbnail"} className="cm-width100">
                        <Dragger 
                            showUploadList  =   {false}
                            onChange        =   {handleChange}
                            beforeUpload    =   {() => {}}
                            accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                            className       =   {`${imageUrl ? 'j-update-thumbnail' : ''}`}>
                            <>
                            {imageUrl || data?._pGetLinkMetadata.ogImage ? 
                                <img
                                    className   =   "j-res-thumbnail"
                                    style       =   {{maxHeight: "180px", objectFit: "scale-down"}}
                                    alt         =   "no thumbnail"
                                    src         =   {data?._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : imageUrl}
                                    onError={(event) => {
                                            event.currentTarget.onerror = null; 
                                            event.currentTarget.src = RESOURCE_TYPE_CONFIG[resource.type]?.imageFile;
                                        }
                                    }
                                />
                            :
                                (
                                    <Space direction="vertical" className="cm-width100">
                                        <MaterialSymbolsRounded font={'unarchive'} size="30"/>
                                        <div className="cm-font-fam500">Upload a thumbnail image</div>
                                        <div className="cm-font-size12">Max size: 10MB</div>
                                    </Space>
                                )
                            }
                                <div className="j-update-thumbnail-icon">
                                    <MaterialSymbolsRounded color="#fff" size="60" font="upload" />
                                </div>
                            </>
                        </Dragger>
                    </Form.Item>
                </div>
                <Space direction='vertical' className='cm-width100' size={15}>
                    <Space className='cm-flex-space-between'>
                        <div className='cm-font-size13'>Resource</div>
                        {
                            initialData === null &&
                                <Space size={10}>
                                    <div className='cm-font-size12'>Upload Options</div>
                                    <Select style={{width: "175px"}} defaultValue={currentUploadType} suffixIcon={<MaterialSymbolsRounded font='expand_more' size='16'/>} onChange={(selectedKey: string) => {handleUploadOptionChange(selectedKey)}}>
                                        <Option key={PASTE_LINK}>Paste Link</Option>
                                        <Option key={UPLOAD_FROM_DEVICE}>Upload from device</Option>
                                    </Select>
                                </Space>
                        }
                    </Space>
                    <div className='j-add-res-content-wrapper'>
                        {getUploadComponent()}
                    </div>
                </Space>
            </Form>
            <div className='j-demo-form-footer'>
                <Space>
                    <Button className="cm-cancel-btn" ghost onClick={() => onClose()}><div className="cm-font-size14 cm-secondary-text">Cancel</div></Button>
                    <Button type="primary" className={`cm-flex-center cm-cancel-btn ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading || !(updatedFile || pastedLink || initialData)}>
                            <Space size={10}>
                                <div className="cm-font-size14">{submitState.text}</div>
                                {
                                    submitState.loading && <Loading color="#fff"/>
                                }
                            </Space>
                        </Button>
                </Space>
            </div>
        </>
    )
}

export default EditResourceForm
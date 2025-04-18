import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Button, Form, Input, Select, Space } from "antd";

import { ARCADE_LOGO, CALENDLY_LOGO, FALL_BACK_RESOURCE, LOOM_LOGO, Length_Input, STORYLANE_LOGO, VIMEO_LOGO, WISITIA_LOGO, YOUTUBE_LOGO } from "../../../constants/module-constants";
import { UPLOAD_EMBED_LINK } from "../config/add-resource-config";
import { GET_LINK_META_DATA } from "../api/library-query";
import { ROOM_RESOURCE_ADDED } from "../../../tracker-constants";
import { AppTracker } from "../../../app-tracker";
import { CommonUtil } from "../../../utils/common-util";
import { LibraryAgent } from "../api/library-agent";
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import DemoEmptyCard from "../../rooms/room-settings/demo-empty-card";
import EmptyText from "../../../components/not-found/empty-text";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;
const { Option }    =   Select;

interface LinkResourceFormProps
{
    setView     :   (arg0: string) => void;
    onClose     :   () => void;
    urlType?    :   string;
    displayName :   string;
    domain      :   string;
    imageIcon   :   string;
    goBack?     :   any;
    resKey?     :   any
}

const LinkResourceForm: FC<LinkResourceFormProps> = (props) => {

    const { onClose, urlType, displayName, domain, imageIcon, goBack, resKey}       =   props;
    
    const { $categories }   =   useContext(GlobalContext);

    const { folderId }  =   useParams();

    const [form]            =   useForm();

    const [imageUrl, setImageUrl]           =   useState<any>(undefined);
    const [pastedLink, setPastedLink]       =   useState<any>();
    const [submitState, setSubmitState]     =   useState({
        text: "Upload",
        loading: false
    });

    const [_getMetaData, { data, loading }]      =   useLazyQuery(GET_LINK_META_DATA, {
        fetchPolicy: "network-only"
    });

    const imageMap: { [key: string]: string } = {
        "Youtube"   : YOUTUBE_LOGO,
        "Loom"      : LOOM_LOGO,
        "Vimeo"     : VIMEO_LOGO,
        "Wisitia"   : WISITIA_LOGO,
        "Arcade"    : ARCADE_LOGO,
        "Storylane" : STORYLANE_LOGO,
        "Calendly"  : CALENDLY_LOGO,
    };

    const getImageUrl = (displayName: string): string | undefined => {        
        return imageMap[displayName];
    };

    const onFinish = (formData: any) => {

        let normalizedUrl = formData.url.trim();
        if (!normalizedUrl.startsWith("https://")) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        setSubmitState({
            loading :   true,
            text    :   "Uploading..."
        })
        
        LibraryAgent.createLinkResource({
            variables: {
                url             :   normalizedUrl,
                title           :   formData.title,
                categories      :   formData.categories,
                urlType         :   urlType,
                thumbnailImage  :   formData.thumbnailImage ? formData.thumbnailImage.file : undefined,
                thumbnailUrl    :   formData.thumbnailImage ? undefined : imageUrl,
                folderUuid      :   folderId === "home" ? undefined : folderId,
                properties : {
                    embedLink    :   resKey === UPLOAD_EMBED_LINK ? true : false
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Resource added successfully !")
                onClose()
                AppTracker.trackEvent(ROOM_RESOURCE_ADDED, {});
            },
            errorCallBack: () => {
                setSubmitState({
                    loading :   false,
                    text    :   "Upload"
                })
            }
        })
    }

    let timeout: any;
    const debounce = function (func: any, delay: any) {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };

    const onChange = (e: any) => {
        const inputValue = e.target.value.trim();
        let normalizedUrl = inputValue;
        if (inputValue &&!inputValue.startsWith("https://")) {
            normalizedUrl = `https://${inputValue}`;
        }
    
        debounce(() => {
            _getMetaData({
                variables: {
                    link: normalizedUrl,
                },
            });
        }, 1000);
    };
    

    useEffect(() => {
        if(data && data._pGetLinkMetadata){
            form.setFieldsValue({
                ["title"]   : data._pGetLinkMetadata.ogTitle,
                ["thumbnailImage"]  :   undefined
            })
            setImageUrl(data._pGetLinkMetadata.ogImage)
        }
    }, [data])

    const getUploadComponent = () => {
        return (
            <Space direction='vertical' className='cm-width100'>
                {
                    !loading && data ?
                        <DemoEmptyCard title={data._pGetLinkMetadata.ogTitle} imgSource={data._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : FALL_BACK_RESOURCE} handleRemove={() => setPastedLink(null)} addResource={false}/>
                    :
                        <DemoEmptyCard  addResource={false}/>
                }
            </Space>
        )        
    }

    return (
        <div className='cm-height100'>
            <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-align-center' size={15}>
                    <MaterialSymbolsRounded font={"arrow_back"} size="20" className="cm-cursor-pointer" weight="400" onClick={() => goBack() && goBack()}/>
                    <Space className="cm-flex">
                        {
                            imageIcon !== "" ? <MaterialSymbolsRounded font={imageIcon} />
                            :
                            <img src={getImageUrl(displayName)} height={30} width={30}/>
                        }
                        {displayName}
                    </Space>
                </Space>
            </div>
            <Form className='cm-form j-add-res-form-body cm-padding15 cm-link-upload' layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item name={"url"} label={"URL"} rules={[{required: true, message: "Please paste a URL", whitespace: true}]} className="cm-width100 cm-secondary-text">
                    <Input prefix={<MaterialSymbolsRounded font="link"/> } value={pastedLink} placeholder={displayName === "Other URLs" ? "https://buyerstage.io" : `https://${displayName.toLowerCase()}${domain}/your_video_id`} allowClear size="large" onChange={(e) => onChange(e)}/>
                </Form.Item>
                <Form.Item name={"title"} label={"Name"} rules={[{required: true, message: "Please enter a name for the resource", whitespace: true}]} className="cm-width100">
                    <Input placeholder="eg: Buyer enablement blog" maxLength={Length_Input} allowClear size="large" disabled={loading} prefix={loading && <Loading/>}/>
                </Form.Item>
                <Form.Item name={"categories"} label={"Categories"} className="cm-width100">
                    <Select 
                        showSearch
                        allowClear
                        size                =   "large" 
                        optionFilterProp    =   "children"
                        className           =   "cm-width100 cm-select" 
                        placeholder         =   "Select category" 
                        mode                =   'multiple'
                        maxTagCount         =   {3}
                        suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                        notFoundContent     =   {
                            <div style={{height:"50px"}}>
                                <EmptyText text="No Categories found"/>
                            </div>
                        }
                    >
                        {$categories?.map((_category: any) => (
                            <Option value={_category.uuid} key={_category.uuid} >{_category.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <div className='j-demo-content-wrapper cm-flex-center' style={{height: "225px"}}>
                    {getUploadComponent()}
                </div>
            </Form>
            <div className='j-add-res-form-footer'>
                <Space>
                    <Button type='primary' ghost onClick={() => onClose()}>Cancel</Button>
                    <Button type="primary" disabled={submitState.loading || loading} className="cm-flex-center" onClick={() => form.submit()}>
                        <Space size={10}>
                            {submitState.text}
                            {submitState.loading && <Loading color="#fff" size='small' />}
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default LinkResourceForm
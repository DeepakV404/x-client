import { FC, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Button, Divider, Form, Input, Space, Typography } from "antd";

import { GET_LINK_META_DATA } from "../../library/api/library-query";
import { FALL_BACK_RESOURCE, LINK_FALLBACK_IMAGE } from "../../../constants/module-constants";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;
const { Text }      =   Typography;

interface LinkResourceFormProps
{
    onClose     :   () => void;
    onSubmit    :   (arg0: any) => void;
}

const LinkResourceForm: FC<LinkResourceFormProps> = (props) => {

    const { onClose, onSubmit }       =   props;

    const [form]            =   useForm();

    const [pastedLink, setPastedLink]       =   useState<any>();
    const [submitState, setSubmitState]     =   useState({
        text: "Upload",
        loading: false
    });

    const [_getMetaData, { data, loading }]      =   useLazyQuery(GET_LINK_META_DATA, {
        fetchPolicy: "network-only"
    });
    
    const onFinish = () => {
        setSubmitState({
            loading :   true,
            text    :   "Uploading..."
        })
        const resource = {
            title: data?._pGetLinkMetadata.ogTitle,
            imgSource: data?._pGetLinkMetadata.ogImage || FALL_BACK_RESOURCE,
            link: pastedLink
        };
        onSubmit(resource);
        onClose(); 
    }

    const getFiles = () => {
        if(pastedLink){
            return (
                <>
                    <span className="cm-font-fam500">Pasted link</span>
                    <div className='cm-flex cm-flex-align-center cm-cursor-pointer cm-border-radius6 cm-padding10 cm-margin-top15' style={{border: "1px solid #f2f2f2", columnGap: "10px"}}>
                        <div style={{width: "106px", height: "60px"}}>
                            <img src={data?._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : LINK_FALLBACK_IMAGE} style={{width: "100%", height: "100%", borderRadius: "6px", objectFit: "scale-down"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= LINK_FALLBACK_IMAGE}}/>
                        </div>
                        <div style={{width: "calc(100% - 150px)"}}>
                            <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: data?._pGetLinkMetadata.ogTitle ? data?._pGetLinkMetadata.ogTitle : pastedLink}} className='cm-font-size15 cm-font-fam500'>{data?._pGetLinkMetadata.ogTitle ? data?._pGetLinkMetadata.ogTitle : pastedLink}</Text>
                        </div>
                        <MaterialSymbolsRounded font={'delete'} size={'18'} color="#DF2222" className='cm-cursor-pointer' onClick={() => setPastedLink(null)}/>
                    </div>
                </>
            )
        }
    }

    useEffect(() => {
        if(data && data._pGetLinkMetadata){
            form.setFieldsValue({
                ["title"]   : data._pGetLinkMetadata.ogTitle,
                ["thumbnailImage"]  :   undefined
            })
            // setImageUrl(data._pGetLinkMetadata.ogImage)
        }
    }, [data])

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
    return (
        <div className='cm-height100'>
            <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    <Space>
                        <MaterialSymbolsRounded font="link"/>
                        <div>Paste Link</div>
                    </Space>
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <Form className='cm-form j-add-res-form-body cm-padding15 cm-link-upload' layout="vertical" form={form} onFinish={onFinish}>
                <div className='j-add-res-content-wrapper cm-flex-center'>
                    <Space direction='vertical' className='cm-width100'>
                        <Space className='cm-width100 cm-space-inherit' direction='vertical'>
                            <div className='cm-flex-center cm-font-fam500 cm-font-size16'>Paste a Link</div>
                            <Input value={pastedLink} size='large' onChange={handlePasteLinkChange} placeholder='Paste a link' prefix={<MaterialSymbolsRounded font='link' size='20' className='cm-margin-right5'/>}/>
                        </Space>
                    </Space>
                </div>
                <Divider dashed={true} style={{borderColor: "#E8E8EC"}}/>
                <div className="cm-margin-top20">
                    {getFiles()}
                </div>
            </Form>
            <div className='j-add-res-form-footer'>
                <Space>
                    <Button type='primary' ghost onClick={() => onClose()}>Cancel</Button>
                    <Button type="primary" disabled={loading || submitState.loading} className={`cm-flex-center ${loading || submitState.loading ? "cm-button-disabled" : ""}`} onClick={() => form.submit()}>
                        <Space size={10}>
                            {submitState.text}
                            {submitState.loading || loading && <Loading color="#fff" size='small' />}
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default LinkResourceForm
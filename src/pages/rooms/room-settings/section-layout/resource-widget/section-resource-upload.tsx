import { useContext, useEffect, useImperativeHandle, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Button, Divider, Form, Input, Space, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

import { GET_LINK_META_DATA, REQUEST_BLOB_URLS } from '../../../../library/api/library-query';
import { ACCEPTED_FILE_TYPES, CHUNK_SIZE } from '../../../../../constants/module-constants';
import { WidgetsAgent } from '../../../../custom-sections/api/widgets-agent';
import { ERROR_CONFIG } from '../../../../../config/error-config';
import { CommonUtil } from '../../../../../utils/common-util';
import { GlobalContext } from '../../../../../globals';

import StageResourceCard from '../../../room-action-plan/stage-resources/stage-resource-card';
import MaterialSymbolsRounded from '../../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../../library/library-modal/library-modal';
import Loading from '../../../../../utils/loading';

const { Dragger }   =   Upload;
const { useForm }   =   Form;

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice"

const SectionResourceUpload = (props: {demoRef: any, resource: any, widget: any, carousel?: any, setIsDrawerOpen: any, component: any }) => {

    const  { demoRef, resource, widget, carousel, setIsDrawerOpen, component } =   props;

    const { $fileListProps }   =   useContext<any>(GlobalContext);

    const { setFileListForMultipleUpload } = $fileListProps

    const [form]                                    =   useForm();

    const [imageUrl, setImageUrl]                   =   useState<string | null>();

    const [currentUploadType, setCurrentUploadType] =   useState("");
    const [uploadedResource, setUploadedResource]   =   useState(carousel ? "" : resource)
    const [showLibrary, setShowLibrary]             =   useState<boolean>(false);

    const [updatedFile, setUpdatedFile]             =   useState<any>();
    const [selectedResource, setSelectedResource]   =   useState<any>();
    const [pastedLink, setPastedLink]               =   useState<any>();

    const [_getMetaData, { data, loading }]         =   useLazyQuery(GET_LINK_META_DATA, {
        fetchPolicy: "network-only"
    });

    const [_getBlobUrls]                            =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    useEffect(() => {
        setUploadedResource(resource)
    }, [resource])

    useEffect(() => {
        window.addEventListener('keydown', (event: any) => {                        
            if(event.key === "Enter") handlePasteLinkChange()
        });

        return () => {
            window.removeEventListener('keydown', (event: any) => {
                if(event.key === "Enter") handlePasteLinkChange()
            });
        };
    }, []);

    const resetAll = () => {
        setUpdatedFile(null)
        setPastedLink(null)
        setSelectedResource(null)
        setUploadedResource(null)
    }

    const handleUploadOptionChange = (_selectedKey: string) => {   
        if(_selectedKey !== currentUploadType) resetAll()
        setCurrentUploadType(_selectedKey)
    }

    const handleFileUpload = async (info: any) => {

        resetAll()
        setCurrentUploadType(UPLOAD_FROM_DEVICE)
        getBase64(info.fileList[0].originFileObj as RcFile, (url) => {
            setImageUrl(url);
        });
        
        setUpdatedFile(info.file)

        const { uid, name, lastModified, lastModifiedDate, size, type } = info.file;
        
        const updatedFile = {
            uid,
            name,
            lastModified,
            lastModifiedDate,
            size,
            type,
            status: 'uploading',
        };

        setFileListForMultipleUpload((prevFileListForMultipleUpload: any) => [
            ...(prevFileListForMultipleUpload || []),
            updatedFile,
        ]);

        try {
            const { urls, contentId, uploadId } = await getPresignedUrls(info.file);

            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                prevFileListForMultipleUpload.map((item: any) =>
                    item.uid === info.file.uid ? { ...item, contentId } : item
                )
            );
    
            CommonUtil.__uploadToS3(
                info.file,           
                urls,                  
                contentId,             
                uploadId,              
                () => {                
                    const resourceInput: any = {
                        widgetUuid      :   widget.uuid,
                        componentUuid   :   component.uuid,
                        isTemplate      :   false
                    }

                    resourceInput.resourceInput = {
                        "blobInput" :   {
                            contentUuid :   contentId,
                            contentType :   info.file.type,
                            fileName    :   info.file.name
                        }
                    }
                    WidgetsAgent.updateResourceComponent({
                        variables: resourceInput,
                        onCompletion: () => {
                            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                                prevFileListForMultipleUpload.map((item: any) =>
                                    item.contentId === contentId
                                        ? { ...item, status: 'completed' }
                                        : item
                                )
                            );
                        },
                        errorCallBack: () => {}
                    })
                },
            );
        } catch  {}
    }

    const getPresignedUrls = async (file: any) => {
        const numberOfParts = Math.ceil(file.size / CHUNK_SIZE);
        const response =  await requestBlobURLs(numberOfParts, file.type)
        return {urls: response.urls, contentId: response.contentUuid, uploadId: response.uploadId}
    }

    const requestBlobURLs: any = async (parts: number, file: string) => {

        const urls = await _getBlobUrls({
            variables: {
                numberOfParts: parts,
                contentType: file
            }
        })

        return urls.data.requestBlobUrls
    }

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handlePasteLinkChange = () => {

        const link = form.getFieldsValue().pastedLink;

        setPastedLink(link)
        if(link.trim()){

            const resourceInput: any = {
                widgetUuid      :   widget.uuid,
                componentUuid   :   component.uuid,
                isTemplate      :   false
            }
            resourceInput.resourceInput = {
                "link"  : link.trim()
            }

            WidgetsAgent.updateResourceComponent({
                variables: resourceInput,
                onCompletion: () => {},
                errorCallBack: () => {}
            })

            _getMetaData({
                variables: {
                    link : link.trim()
                }
            })
        }
    }

    const handleOnSelectResource = (resources: any) => {
        const resourceInput: any = {
            widgetUuid      :   widget.uuid,
            componentUuid   :   component.uuid,
            isTemplate      :   false
        }
        resourceInput.resourceInput = {
            "uuid"  : resources[0].uuid
        }
        WidgetsAgent.updateResourceComponent({
            variables: resourceInput,
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    useImperativeHandle(demoRef, () => ({
        currentUploadType   :   currentUploadType,
        updatedFile         :   updatedFile,
        selectedResource    :   selectedResource,
        pastedLink          :   pastedLink,
        hasData             :   (updatedFile || selectedResource || pastedLink)
    }))

    const handleRemoveContent = () => {
        setUploadedResource(null);
        const resourceInput: any = {
            widgetUuid      :   widget.uuid,
            componentUuid   :   component.uuid,
            isTemplate      :   false,
            resourceInput   :   {}
        }

        WidgetsAgent.updateResourceComponent({
            variables: resourceInput,
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })

    }

    const PasteLinkComponent = (
        <Form form={form} style={{marginBottom: "30px"}}>
            <Form.Item name={"pastedLink"} style={{marginBottom: "10px"}}>
                <Input 
                    required 
                    autoComplete=   'off'
                    value       =   {pastedLink} 
                    size        =   'large' 
                    placeholder =   'Paste a link' 
                    prefix      =   {<MaterialSymbolsRounded font='link' size='20' className='cm-margin-right5'/>}
                    suffix      =   {loading ? <Loading /> : null}
                />
            </Form.Item>
            <div className='cm-float-right'>
                <Form.Item noStyle>
                    <Button loading={loading} disabled={loading} className='cm-font-size13' type='primary' onClick={handlePasteLinkChange}>Add Link</Button>
                </Form.Item>
            </div>
        </Form>
    )

    const getUploadComponent = () => {
        
        if(uploadedResource?.value?.uuid){
            return (
                <>
                    {
                        currentUploadType === PASTE_LINK &&
                            <Space className='cm-width100 cm-margin-bottom10' direction='vertical'>
                                <div className='cm-flex-center cm-font-fam500 cm-font-size16'>Paste a Link</div>
                                {PasteLinkComponent}
                            </Space>
                    }
                    <StageResourceCard title={uploadedResource?.value?.title} imgSource={uploadedResource?.value?.content?.thumbnailUrl ? uploadedResource.value.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(uploadedResource?.value?.content?.type)} handleRemove={handleRemoveContent}/>
                </>
            )
        } else {
            switch (currentUploadType) {
                case PASTE_LINK:
                    return (
                        <Space direction='vertical' className='cm-width100'>
                            <Space className='cm-width100 cm-margin-bottom10' direction='vertical'>
                                <div className='cm-flex-center cm-font-fam500 cm-font-size16'>Paste a Link</div>
                                <div>{PasteLinkComponent}</div>
                            </Space>
                            {
                                pastedLink && data ?
                                    <>
                                        <span className="cm-font-fam500">Pasted link</span>
                                        <StageResourceCard title={data._pGetLinkMetadata.ogTitle} imgSource={data._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : CommonUtil.__getResourceFallbackImage("video")} handleRemove={() => setPastedLink(null)}/>
                                    </>
                                :
                                    null
                            }
                        </Space>
                    )
            
                case SELECT_FROM_LIBRARY:
                    return (
                        <div className='cm-width100'>
                            {
                                selectedResource ?
                                    <StageResourceCard title={selectedResource[0].title} imgSource={selectedResource[0].content.thumbnailUrl ? selectedResource[0].content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(selectedResource[0].content.type)} handleRemove={() => setSelectedResource(null)}/>
                                :
                                    null
                            }
                        </div>
                    )
    
                case UPLOAD_FROM_DEVICE:
                    return (
                        <>
                            {
                                updatedFile ? 
                                    <StageResourceCard title={updatedFile.name} imgSource={updatedFile.type.includes("image") ? imageUrl : CommonUtil.__getResourceFallbackImage(updatedFile.type)} handleRemove={() => setUpdatedFile(null)}/>
                                :
                                    null
                            }
                        </>
                    )
            }        
        }
    }

    return (
        <>
            <Space className="j-marketplace-overview-res-card cm-flex-center" size={20}>
                <div className="j-marketplace-res-upload-card cm-flex-center" key={PASTE_LINK} onClick={() => handleUploadOptionChange(PASTE_LINK)}>
                    <Space direction="vertical" className="cm-flex-center">
                        <MaterialSymbolsRounded font="link"/>
                        <div>Paste Link</div>
                    </Space>
                </div>
                <div className="j-marketplace-res-upload-card cm-flex-center" key={SELECT_FROM_LIBRARY} onClick={() => {handleUploadOptionChange(SELECT_FROM_LIBRARY); setShowLibrary(true)}}>
                    <Space direction="vertical" className="cm-flex-center">
                        <MaterialSymbolsRounded font="home_storage"/>
                        <div>From Library</div>
                    </Space>
                </div>
                <Dragger className='j-upload-from-device-option-wrapper' beforeUpload={()=> {return false}} onChange={handleFileUpload}  showUploadList={false} accept={ACCEPTED_FILE_TYPES}>
                    <div className="j-marketplace-res-upload-card cm-flex-center" key={UPLOAD_FROM_DEVICE}>
                        <Space direction="vertical" className="cm-flex-center">
                            <MaterialSymbolsRounded font="upload"/>
                            <div>From Device</div>
                        </Space>
                    </div>
                </Dragger>
            </Space>
            {
                currentUploadType || uploadedResource?.value 
                ? 
                    <>
                        <Divider dashed={true} style={{marginBlock: "0px", borderColor: "#D9D9D9"}}/> 
                        <div className='j-section-res-content-wrapper cm-flex-center'>
                            <Space direction='vertical' className='cm-width100'>
                                {getUploadComponent()}
                            </Space>
                        </div>
                    </>
                :
                    null
            }
            <LibraryModal
                isOpen                  =   {showLibrary}
                onClose                 =   {() => setShowLibrary(false)}
                initialFilter           =   {[]}
                getSelectedResourceId   =   {(resource: any) => {setSelectedResource(resource); setShowLibrary(false); handleOnSelectResource(resource)}}
                multipleResource        =   {false}
                pdfCustomPageSelection  =   {{isPDFSelection: true, widget: widget, module: "widget"}}
                setIsDrawerOpen         =   {setIsDrawerOpen}
            />
        </>
    )
}

export default SectionResourceUpload
import { useContext, useImperativeHandle, useState } from 'react';
import { Button, Divider, Form, Input, Space, Upload } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { RcFile } from 'antd/es/upload';

import { PASTE_LINK, SELECT_FROM_LIBRARY, UPLOAD_FROM_DEVICE } from './room-edit-home-form';
import { ACCEPTED_FILE_TYPES} from '../../../../constants/module-constants';
import { GET_LINK_META_DATA } from '../../../library/api/library-query';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';
import { RoomsAgent } from '../../api/rooms-agent';
import { useForm } from 'antd/es/form/Form';

import StageResourceCard from '../../room-action-plan/stage-resources/stage-resource-card';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../../rooms/library/library-modal/library-modal';
import Loading from '../../../../utils/loading';

const { Dragger }   =   Upload;

const RoomPitchForm = (props: {pitchRef: any, pitchVideo: any}) => {

    const { $dictionary }           =    useContext(GlobalContext)

    const  { pitchRef, pitchVideo } =   props;

    const [form]                    =   useForm();

    const { roomId }    =   useParams();

    const [initialData, setInitialData]             =   useState(pitchVideo);

    const [currentUploadType, setCurrentUploadType] =   useState("");

    const [showLibrary, setShowLibrary]             =   useState<boolean>(false);
    const [imageUrl, setImageUrl]                   =   useState<string | null>();

    const [updatedFile, setUpdatedFile]             =   useState<any>();
    const [selectedResource, setSeletedResource]    =   useState<any>();
    const [pastedLink, setPastedLink]               =   useState<any>();

    const [_getMetaData, { data, loading }]         =   useLazyQuery(GET_LINK_META_DATA, {
        fetchPolicy: "network-only"
    });

    const resetAll = () => {
        setUpdatedFile(null)
        setSeletedResource(null)
        setPastedLink(null)
        setInitialData(null)
        setCurrentUploadType("")
    }

    const handleUploadOptionChange = (_selectedKey: string) => {  
        if(_selectedKey !== currentUploadType) resetAll()
        setCurrentUploadType(_selectedKey)
    }

    const handleFileUpload = (_file: any) => {
        resetAll()
        setCurrentUploadType(UPLOAD_FROM_DEVICE)
        getBase64(_file.fileList[0].originFileObj as RcFile, (url) => {
            setImageUrl(url);
        });
        setUpdatedFile(_file.file)
    }

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handlePasteLinkChange = () => {
        const link = form.getFieldsValue().pastedLink;        
        setPastedLink(link)
        if(link){
            _getMetaData({
                variables: {
                    link : link
                }
            })
        }
    }

    const normalizedResource = Array.isArray(selectedResource) ? selectedResource[0] : selectedResource

    useImperativeHandle(pitchRef, () => ({
        currentUploadType   :   currentUploadType,
        updatedFile         :   updatedFile,
        selectedResource    :   normalizedResource,
        pastedLink          :   pastedLink,
        hasData             :   (updatedFile || normalizedResource || pastedLink)
    }))

    const hadleRemoveContent = () => {
        RoomsAgent.removePitch({
            variables: {
                roomUuid    :   roomId
            },
            onCompletion: () => {
                resetAll()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const PasteLinkComponent = (
        <Form form={form}>
            <Form.Item name={"pastedLink"} style={{marginBottom: "10px"}}>
                <Input 
                    required 
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
        if(initialData){
            return (
                <>
                    {
                        currentUploadType === PASTE_LINK &&
                            <div className='cm-width100'>
                                {PasteLinkComponent}
                            </div>
                    }
                    <StageResourceCard title={initialData?.title} imgSource={initialData.content?.thumbnailUrl ? initialData.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(initialData.content?.type)} handleRemove={hadleRemoveContent}/>
                </>
            )
        } else {
            switch (currentUploadType) {  
                case PASTE_LINK:
                    return (
                        <Space direction='vertical' className='cm-width100'>
                            <Space className='cm-width100 cm-margin-bottom10' direction='vertical'>
                                <div className='cm-flex-center cm-font-fam500 cm-font-size16'>Paste a Link</div>
                                {PasteLinkComponent}
                            </Space>
                            {
                                pastedLink && !loading && data ?
                                    <>
                                        <span className="cm-font-fam500">Pasted link</span>
                                        <StageResourceCard title={data._pGetLinkMetadata.ogTitle || form.getFieldsValue().pastedLink} imgSource={data._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : CommonUtil.__getResourceFallbackImage("video")} handleRemove={() => resetAll()}/>
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
                                normalizedResource?
                                    <StageResourceCard title={normalizedResource.title} imgSource={normalizedResource?.content?.thumbnailUrl ? normalizedResource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(normalizedResource.content.type)} handleRemove={() => resetAll()}/>
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
                                    <StageResourceCard title={updatedFile.name} imgSource={updatedFile.type.includes("image") ? imageUrl : CommonUtil.__getResourceFallbackImage(updatedFile.type)} handleRemove={() => resetAll()}/>
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
                        <div>Select from {$dictionary.library.title}</div>
                    </Space>
                </div>
                <Dragger className='j-upload-from-device-option-wrapper' beforeUpload={()=> {return false}} onChange={handleFileUpload} showUploadList={false} accept={ACCEPTED_FILE_TYPES}>
                    <div className="j-marketplace-res-upload-card cm-flex-center" key={UPLOAD_FROM_DEVICE}>
                        <Space direction="vertical" className="cm-flex-center">
                            <MaterialSymbolsRounded font="upload"/>
                            <div>from Device</div>
                        </Space>
                    </div>
                </Dragger>
            </Space>
            {!!(currentUploadType || initialData) && 
                <>
                    <Divider dashed={true} style={{marginBlock: "0px", borderColor: "#D9D9D9"}}/> 
                    <div className='j-section-res-content-wrapper cm-flex-center'>
                        <Space direction='vertical' className='cm-width100'>
                            {getUploadComponent()}
                        </Space>
                    </div> 
                </>
            }
            <LibraryModal
                isOpen                  =   {showLibrary}
                onClose                 =   {() => setShowLibrary(false)}
                initialFilter           =   {[]}
                getSelectedResourceId   =   {(resource: any) => {setSeletedResource(resource); setShowLibrary(false)}}
            />
        </>
    )
}

export default RoomPitchForm
import { useContext, useImperativeHandle, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Button, Input, Select, Space, Upload } from 'antd';

import { ACCEPTED_VIDEO_TYPES, FALL_BACK_RESOURCE } from '../../../../constants/module-constants';
import { PASTE_LINK, SELECT_FROM_LIBRARY, UPLOAD_FROM_DEVICE } from './demo-edit-form';
import { LINK, VIDEO } from '../../../library/config/resource-type-config';
import { GET_LINK_META_DATA } from '../../../library/api/library-query';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';
import { RoomsAgent } from '../../api/rooms-agent';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../library/library-modal/library-modal';
import DemoEditEmptyCard from './demo-edit-empty-card';

const { Option }    =   Select;
const { Dragger }   =   Upload;

const DemoEditResourceForm = (props: {demoRef: any, type: string, usecase: any}) => {

    const  { demoRef, type, usecase } =   props;

    const { $dictionary }      =    useContext(GlobalContext)

    const [initialData, setInitialData]             =   useState(type === "video" ? usecase?.video : usecase?.walkthrough);

    const [currentUploadType, setCurrentUploadType] =   useState(PASTE_LINK);

    const [showLibrary, setShowLibrary]             =   useState<boolean>(false);

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

    useImperativeHandle(demoRef, () => ({
        currentUploadType   :   currentUploadType,
        updatedFile         :   updatedFile,
        selectedResource    :   selectedResource,
        pastedLink          :   pastedLink,
        hasData             :   (updatedFile || selectedResource || pastedLink)
    }))

    const handleRemoveContent = () => {
        RoomsAgent.removeUsecaseContent({
            variables: {
                usecaseUuid: usecase.uuid, 
                contentType: type === "video" ? "VIDEO" : "WALKTHROUGH"
            },
            onCompletion: () => {
                resetAll()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const getUploadComponent = () => {
        if(initialData){
            return <DemoEditEmptyCard title={initialData.title} imgSource={initialData.content.thumbnailUrl ? initialData.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(initialData.content.type)} handleRemove={() => handleRemoveContent()}/>
        }else{
            switch (currentUploadType) {
                case PASTE_LINK:
                    return (
                        <Space direction='vertical' className='cm-width100'>
                            <Space className='cm-width100 cm-space-inherit' direction='vertical'>
                                <div className='cm-flex-center cm-font-fam500 cm-font-size16'>Paste a Link</div>
                                <Input value={pastedLink} onChange={handlePasteLinkChange} size='large' placeholder='Paste a link' prefix={<MaterialSymbolsRounded font='link' size='20' className='cm-margin-right5'/>}/>
                            </Space>
                            {
                                pastedLink && !loading && data ?
                                    <DemoEditEmptyCard title={data._pGetLinkMetadata.ogTitle} imgSource={data._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : CommonUtil.__getResourceFallbackImage("video")} handleRemove={() => setPastedLink(null)}/>
                                :
                                    <DemoEditEmptyCard/>
                            }
                        </Space>
                    )
            
                case SELECT_FROM_LIBRARY:
                    return (
                        <Space direction='vertical' className='cm-width100 '>
                            <div className='cm-flex-center'>
                                <Button className='cm-flex-center' onClick={() => setShowLibrary(true)}>
                                    {selectedResource ? "Reselect" : "Select"} from {$dictionary.library.title}
                                </Button>
                            </div>
                            {
                                selectedResource ?
                                    <DemoEditEmptyCard title={selectedResource.title} imgSource={selectedResource.content.thumbnailUrl ? selectedResource.content.thumbnailUrl : FALL_BACK_RESOURCE} handleRemove={() => setSeletedResource(null)}/>
                                :
                                    <DemoEditEmptyCard/>
                            }
                        </Space>
                    )
    
                case UPLOAD_FROM_DEVICE:
                    return (
                        <Space direction='vertical' className='cm-width100 '>
                            <Dragger className='j-demo-file-dragger' beforeUpload={()=> {return false}} onChange={handleFileUpload}  showUploadList={false} accept={ACCEPTED_VIDEO_TYPES}>
                                <Space direction='vertical'>
                                    <Button>Choose File</Button>
                                    <div className='cm-font-size12'>Click or drag file to this area to upload</div>
                                </Space>
                            </Dragger>
                            {
                                updatedFile ? 
                                    <DemoEditEmptyCard title={updatedFile.name} imgSource={FALL_BACK_RESOURCE} handleRemove={() => setUpdatedFile(null)}/>
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
            <Space direction='vertical' className='cm-width100' size={15}>
                <Space className='cm-flex-space-between'>
                    {   
                        type === "video" ?
                            <Space>
                                <MaterialSymbolsRounded font="smart_display" size="24" color={"#DF2222"}/>
                                <div className='cm-font-fam500 cm-font-size16'>Video</div>
                            </Space>
                        :
                            <Space>
                                <MaterialSymbolsRounded font="tour" size="24" color={"#3176CD"}/>
                                <div className='cm-font-fam500 cm-font-size16'>Tour</div>
                            </Space>
                    }
                    <Space size={10}>
                        <div className='cm-font-size12'>Upload Options</div>
                        <Select style={{width: "175px"}} suffixIcon={<MaterialSymbolsRounded font='expand_more' size='16'/>} defaultValue={currentUploadType} onChange={(selectedKey: string) => handleUploadOptionChange(selectedKey)}>
                            <Option key={PASTE_LINK}>Paste Link</Option>
                            <Option key={SELECT_FROM_LIBRARY}>Select from {$dictionary.library.title}</Option>
                            <Option key={UPLOAD_FROM_DEVICE}>Upload from device</Option>
                        </Select>
                    </Space>
                </Space>
                <div className='j-demo-content-wrapper cm-flex-center'>
                    {getUploadComponent()}
                </div>
            </Space>
            <LibraryModal
                isOpen                  =   {showLibrary}
                onClose                 =   {() => setShowLibrary(false)}
                initialFilter           =   {[VIDEO, LINK]}
                getSelectedResourceId   =   {(resource: any) => {setSeletedResource(resource); setShowLibrary(false)}}
            />
        </>
    )
}

export default DemoEditResourceForm
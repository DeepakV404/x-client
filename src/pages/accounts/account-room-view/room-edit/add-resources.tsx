import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Space, Tooltip, Typography, Upload } from 'antd';

import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { ACCEPTED_FILE_TYPES } from '../../../../constants/module-constants';
import { GlobalContext } from '../../../../globals';
import { AccountsAgent } from '../../api/accounts-agent';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../../rooms/library/library-modal/library-modal';

const { Dragger }   =   Upload;
const { useForm }   =   Form;
const { Text }      =   Typography;

const AddResources = (props: {setEditView: (arg0: boolean) => void, currentStage?: string}) => {

    const { $dictionary }      =    useContext(GlobalContext)

    const { setEditView, currentStage }   =   props;

    const params    =   useParams();
    const [form]    =   useForm();

    const [showLibraryModal, setShowLibraryModal]   =   useState(false);
    const [selectedResource, setSelectedResource]   =   useState<any>(null);
    const [uploadedFile, setUploadedFile]           =   useState<any>(null);
    const [pastedLink, setPastedLink]               =   useState<string | null>(null);

    const handleUpload = (file: any) => {
        setSelectedResource(null)
        setPastedLink(null)

        setUploadedFile(file.file)
    }

    const handleSelectResource = (resource: any) => {
        setPastedLink(null)
        setUploadedFile(null)

        setSelectedResource(resource)

        setShowLibraryModal(false)
    }

    const handlePasteLinkChange = (event: any) => {
        setUploadedFile(null)
        setSelectedResource(null)

        setPastedLink(event.target.value)
    }

    const onFinish = () => {
        const updateResource = (resourceId: string) => {
            AccountsAgent.addStageResources({
                variables: {
                    roomUuid: params.roomId,
                    stageUuid: currentStage,
                    resourceUuid: resourceId
                },
                onCompletion: () => {
                    setEditView(false)
                    CommonUtil.__showSuccess("Resource added successfully");
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }

        if(pastedLink){
            AccountsAgent.createRoomLinkResource({
                variables: {
                    roomUuid        :   params.roomId,
                    url             :   pastedLink,
                },
                onCompletion: (data: any) => {
                    updateResource(data.createRoomLinkResource._id)
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else if(uploadedFile){
            AccountsAgent.createRoomBlobResource({
                variables: {
                    roomUuid    :   params.roomId,
                    title       :   uploadedFile.name, 
                    content     :   uploadedFile
                },
                onCompletion: (data: any) => {
                    updateResource(data.createRoomBlobResource._id)
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else if(selectedResource){
            updateResource(selectedResource._id)
        }
    }

    const getFileCard = () => {
        if(selectedResource || uploadedFile || pastedLink){
            if(selectedResource){
                return(
                    <Card className='j-uploaded-stage-file-card'>
                        <Space className='cm-width100 cm-flex-space-between'>
                            <div className='cm-font-fam500'>{selectedResource.title}</div>
                            <MaterialSymbolsRounded font='close' size='18' onClick={() => {setSelectedResource(null); form.resetFields()}} className='cm-cursor-pointer'/>
                        </Space>
                    </Card>
                )
            }else if(uploadedFile){
                return(
                    <Card className='cm-width100 j-uploaded-stage-file-card cm-flex-space-between'>
                        <Space className='cm-width100 cm-flex-space-between'>
                            <Space direction='vertical' size={0}>
                                <div className='cm-font-fam500'>{uploadedFile.name}</div>
                                <span className='cm-light-text cm-font-fam400 cm-font-size12'>(Size: {CommonUtil.__getFileSize(uploadedFile, 2)})</span>
                            </Space>
                            <MaterialSymbolsRounded font='close' size='18' onClick={() => {setUploadedFile(null); form.resetFields()}} className='cm-cursor-pointer'/>
                        </Space>
                    </Card>
                )
            }else if(pastedLink){
                return (
                    <Card className='cm-width100 j-uploaded-stage-file-card cm-flex-space-between'>
                        <Space className='cm-width100 cm-flex-space-between'>
                            <Space>
                                <MaterialSymbolsRounded font='link' size='18'/>
                                <Text className='cm-font-fam500' style={{maxWidth: "calc(100% - 100px)"}}><a>{pastedLink}</a></Text>
                            </Space>
                            <MaterialSymbolsRounded font='close' size='18'onClick={() => {setPastedLink(null); form.resetFields()}} className='cm-cursor-pointer'/>
                        </Space>
                    </Card>
                )
            }
        }else return null
    }

    const getCTA = () => {
        if(selectedResource || uploadedFile || pastedLink){
            return (
                <Tooltip title="Add Resource">
                    <div className='j-pitch-edit cm-cursor-pointer' onClick={() => form.submit()}>
                        <MaterialSymbolsRounded font='done' size='20' className='cm-user-select-none'/>
                    </div>
                </Tooltip>
            )
        }else{
            return (
                <div className='j-pitch-edit cm-cursor-pointer' onClick={() => setEditView(false)}>
                    <MaterialSymbolsRounded font='close' size='20' className='cm-user-select-none'/>
                </div>
            )
        }
    }

    return (
        <>
            {
                getCTA()
            }
            <Form form={form} onFinish={onFinish}>
                <Space direction="vertical" className="cm-width100 cm-space-inherit cm-flex-center" size={25} >
                    {
                        getFileCard()
                    }
                    <Space direction="vertical" className="cm-width100 cm-space-inherit cm-flex-center" size={10} >
                        <div className='cm-flex-center' style={{columnGap: "8px"}}>
                            <Button disabled={uploadedFile || pastedLink} onClick={() => setShowLibraryModal(true)}>Select from {$dictionary.library.title}</Button>
                            <div className="cm-empty-text">or</div>
                            <Form.Item name="fileUrl" noStyle>
                                <Input style={{width: "calc(100% - 100px)"}} onChange={handlePasteLinkChange} allowClear placeholder={"Paste a url"} prefix={<MaterialSymbolsRounded font="link" size="20"/>} disabled={selectedResource || uploadedFile}/>    
                            </Form.Item>
                        </div>
                        <Form.Item name="blobFile" noStyle>
                            <Dragger beforeUpload={()=> {return false}} onChange={handleUpload}  showUploadList={false} disabled={selectedResource || pastedLink} accept={ACCEPTED_FILE_TYPES}>
                                <Space direction="vertical" className="cm-width100 cm-margin-top20 cm-margin-bottom20">
                                    <MaterialSymbolsRounded font={'unarchive'} size="35"/>
                                    <div className="cm-font-fam500">Upload a resource</div>
                                    <div className="cm-font-size12">Max size: 100MB</div>
                                </Space>
                            </Dragger> 
                        </Form.Item>
                    </Space>
                </Space>
            </Form>
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resource: any) => handleSelectResource(resource)}   
                initialFilter           =   {[]}
            />
        </>
    )
}

export default AddResources
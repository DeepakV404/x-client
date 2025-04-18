import { FC, useContext, useState } from 'react';
import { Button, Card, Form, Input, Space, Typography, Upload } from 'antd';

import { RoomTemplateAgent } from '../../../templates/api/room-template-agent';
import { ACCEPTED_FILE_TYPES } from '../../../../constants/module-constants';
import { LibraryAgent } from '../../../library/api/library-agent';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../library/library-modal/library-modal';

const { Text }      =   Typography;
const { Dragger }   =   Upload;
const { useForm }   =   Form;

interface UploadActionProps 
{
    actionId            :   string;
    defaultActionData   :   any
}

const UploadAction: FC<UploadActionProps> = (props) => {

    const { actionId, defaultActionData }   =   props;

    const { $dictionary }      =    useContext(GlobalContext)

    const [form]    =   useForm();

    const [showLibraryModal, setShowLibraryModal]   =   useState(false);
    const [selectedResource, setSelectedResource]   =   useState<any>(null);
    const [uploadedFile, setUploadedFile]           =   useState<any>(null);
    const [pastedLink, setPastedLink]               =   useState<string | null>(null);

    const handleRemove = (resourceId: string) => {

        RoomTemplateAgent.removeActionPointResource({
            variables: {
                actionPointUuid:   actionId,
                resourceUuid:   resourceId
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Resource removed successfully");
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    } 

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
            RoomTemplateAgent.mapActionPointResource({
                variables: {
                    actionPointUuid:   actionId,
                    resourceUuid: resourceId
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess("Resource updated successfully");
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }

        if(pastedLink){
            LibraryAgent.createLinkResource({
                variables: {
                    url             :   pastedLink,
                },
                onCompletion: (data: any) => {
                    updateResource(data.createLinkResource.uuid)
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else if(uploadedFile){
            LibraryAgent.createBlobResource({
                variables: {
                    title       :   uploadedFile.name, 
                    content     :   uploadedFile
                },
                onCompletion: (data: any) => {
                    updateResource(data.createBlobResource.uuid)
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
                    <Space className='j-uploaded-pitch-card cm-flex-space-between' style={{width: "458px"}}>
                        <Text style={{maxWidth: "400px"}} ellipsis={{tooltip: selectedResource.title}} className='cm-font-fam500'>{selectedResource.title}</Text>
                        <MaterialSymbolsRounded font='close' size='18' onClick={() => {setSelectedResource(null); form.resetFields()}} className='cm-cursor-pointer'/>
                    </Space>
                )
            }else if(uploadedFile){
                return(
                    <Space className='j-uploaded-pitch-card cm-flex-space-between' style={{width: "458px"}}>
                        <Space direction='vertical' size={0}>
                            <Text style={{maxWidth: "400px"}} ellipsis={{tooltip: uploadedFile.name}} className='cm-font-fam500'>{uploadedFile.name}</Text>
                            <span className='cm-light-text cm-font-fam400 cm-font-size12'>(Size: {CommonUtil.__getFileSize(uploadedFile, 2)})</span>
                        </Space>
                        <MaterialSymbolsRounded font='close' size='18' onClick={() => {setUploadedFile(null); form.resetFields()}} className='cm-cursor-pointer'/>
                    </Space>
                )
            }else if(pastedLink){
                return (
                    <Space className='j-uploaded-pitch-card cm-flex-space-between' style={{width: "458px"}}>
                        <Text style={{maxWidth: "400px"}} ellipsis={{tooltip: pastedLink}} className='cm-font-fam500'>{pastedLink}</Text>
                        <MaterialSymbolsRounded font='close' size='18'onClick={() => {setPastedLink(null); form.resetFields()}} className='cm-cursor-pointer'/>
                    </Space>
                )
            }
        }else return null
    }

    const getCTA = () => {
        if(selectedResource || uploadedFile || pastedLink){
            return (
                <Button className='cm-float-right' size='small' type='primary' onClick={() => form.submit()}>
                    <div className='cm-font-size12'>Update</div>
                </Button>
            )
        }else{
            return null
        }
    }

    return (
        <Space direction='vertical' className='cm-width100' size={15}> 

            {
                getCTA()
            }
        
            {
                defaultActionData?.resources &&
                    defaultActionData.resources.map((_resource: any) => (
                        <Card className="j-action-download-card" hoverable key={_resource.resource.uuid}>
                            <Space className="cm-flex-space-between">
                                <Text className="j-action-text cm-font-size14 cm-font-fam400" ellipsis={{tooltip: _resource.resource.title}} style={{maxWidth: "200px"}}>{_resource.resource.title}</Text>
                                <Space size={10}>
                                    <MaterialSymbolsRounded font="delete" size="22" className="cm-cursor-pointer" onClick={() => handleRemove(_resource.resource.uuid)}/>
                                    <MaterialSymbolsRounded font="download" size="22" className="cm-cursor-pointer" onClick={() => {}}/>
                                </Space>
                            </Space>
                        </Card>
                    ))
            }
            <Form form={form} onFinish={onFinish} className='j-action-view-upload-wrap'>
                <Space direction="vertical" className="cm-width100 cm-space-inherit cm-flex-center" size={25} >
                    {
                        getFileCard()
                    }
                    <Space direction="vertical" className="cm-width100 cm-space-inherit cm-flex-center" size={10} >
                        <Form.Item name="fileUrl" noStyle>
                            <Input onChange={handlePasteLinkChange} size="large" allowClear placeholder={"Paste a url"} prefix={<MaterialSymbolsRounded font="link" size="20"/>} disabled={selectedResource || uploadedFile}/>    
                        </Form.Item>
                        <div className="cm-flex-center cm-light-text">or</div>
                        <div className='cm-flex-center'>
                            <Button disabled={uploadedFile || pastedLink} onClick={() => setShowLibraryModal(true)} type='primary'>Select from {$dictionary.library.title}</Button>
                        </div>
                        <div className="cm-flex-center cm-light-text">or</div>
                        <Form.Item name="blobFile" noStyle>
                            <Dragger beforeUpload={()=> {return false}} onChange={handleUpload}  showUploadList={false} disabled={selectedResource || pastedLink} accept={ACCEPTED_FILE_TYPES}>
                                <Space direction="vertical" size={10}>
                                    <MaterialSymbolsRounded font="upload" size="32" />
                                    <div className="cm-font-size16">Click or drag file to this area to upload</div>
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
        </Space>
    )
}

export default UploadAction
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Input, Space, Typography, Upload } from 'antd';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../library/library-modal/library-modal';

import { RoomTemplateAgent } from '../../../templates/api/room-template-agent';
import { LibraryAgent } from '../../../library/api/library-agent';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { ACCEPTED_FILE_TYPES } from '../../../../constants/module-constants';
import { GlobalContext } from '../../../../globals';

const { useForm }   =   Form;
const { Text }      =   Typography;
const { Dragger }   =   Upload;

const AddResourceForm = (props: {onClose: () => void}) => {

    const { onClose }   =   props;

    const { $dictionary }      =    useContext(GlobalContext)

    const [form]    =   useForm();
    const params    =   useParams();

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
        const addResource = (resourceId: string) => {
            RoomTemplateAgent.updateRoomTemplateResources({
                variables: {
                    templateUuid: params.roomTemplateId, 
                    resourcesUuid: [resourceId], 
                    action: "ADD"
                },
                onCompletion: () => {
                    onClose()
                    CommonUtil.__showSuccess("Resource added successfully");
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
                    addResource(data.createLinkResource.uuid)
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
                    addResource(data.createBlobResource.uuid)
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else if(selectedResource){
            addResource(selectedResource.uuid)
        }
    }

    const getFileCard = () => {
        if(selectedResource || uploadedFile || pastedLink){
            if(selectedResource){
                return(
                    <Space className='j-uploaded-pitch-card cm-flex-space-between '>
                        <Text style={{maxWidth: "400px"}} ellipsis={{tooltip: selectedResource.title}} className='cm-font-fam500'>{selectedResource.title}</Text>
                        <MaterialSymbolsRounded font='close' size='18' onClick={() => {setSelectedResource(null); form.resetFields()}} className='cm-cursor-pointer'/>
                    </Space>
                )
            }else if(uploadedFile){
                return(
                    <Space className='j-uploaded-pitch-card cm-flex-space-between' >
                        <Space direction='vertical' size={0}>
                            <Text style={{maxWidth: "400px"}} ellipsis={{tooltip: uploadedFile.name}} className='cm-font-fam500'>{uploadedFile.name}</Text>
                            <span className='cm-light-text cm-font-fam400 cm-font-size12'>(Size: {CommonUtil.__getFileSize(uploadedFile, 2)})</span>
                        </Space>
                        <MaterialSymbolsRounded font='close' size='18' onClick={() => {setUploadedFile(null); form.resetFields()}} className='cm-cursor-pointer'/>
                    </Space>
                )
            }else if(pastedLink){
                return (
                    <Space className='j-uploaded-pitch-card cm-flex-space-between ' >
                        <Text style={{maxWidth: "400px"}} ellipsis={{tooltip: pastedLink}} className='cm-font-fam500'>{pastedLink}</Text>
                        <MaterialSymbolsRounded font='close' size='18'onClick={() => {setPastedLink(null); form.resetFields()}} className='cm-cursor-pointer'/>
                    </Space>
                )
            }
        }else return null
    }

    return (
        <div className='cm-width100'>
             <Form form={form} onFinish={onFinish} className='cm-margin-top20' layout='vertical'>
                <Space direction="vertical" className="cm-width100 cm-space-inherit cm-flex-center" size={25} >
                    <Space direction="vertical" className="cm-width100 cm-space-inherit cm-flex-center" size={10} >
                        <Form.Item name="fileUrl" label={"Paste a Link"}>
                            <Input onChange={handlePasteLinkChange} size="large" allowClear placeholder={"Paste a Link"} prefix={<MaterialSymbolsRounded font="link" size="20"/>} disabled={selectedResource || uploadedFile}/>    
                        </Form.Item>
                        <Form.Item name="blobFile" label={"Upload a file"}>
                            <Dragger beforeUpload={()=> {return false}} onChange={handleUpload}  showUploadList={false} disabled={selectedResource || pastedLink} accept={ACCEPTED_FILE_TYPES}>
                                <Space direction="vertical" size={25}>
                                    <MaterialSymbolsRounded font="upload" size="25" />
                                    <div className="cm-font-size14">Click or drag file to this area to upload</div>
                                </Space>
                            </Dragger>
                        </Form.Item>
                        <div className="cm-flex-center cm-light-text">or</div>
                        <div className='cm-flex-center'>
                            <Button disabled={uploadedFile || pastedLink} onClick={() => setShowLibraryModal(true)} type='primary' size='large'>
                                <div className='cm-font-size14'>Select from {$dictionary.library.title}</div>
                            </Button>
                        </div>
                        {
                            getFileCard()
                        }
                        <Space className='cm-float-right cm-margin-top20'>
                            <Form.Item noStyle>
                                <Button className='cm-float-right' type='primary' size='large' ghost onClick={() => onClose && onClose()}>
                                    <div className='cm-font-size14'>Cancel</div>
                                </Button>
                            </Form.Item>
                            <Form.Item noStyle>
                                <Button type='primary' onClick={() => form.submit()} size='large' disabled={!(selectedResource || uploadedFile || pastedLink)}>
                                    <div className='cm-font-size14'>Add resource</div>
                                </Button>
                            </Form.Item>
                        </Space>
                    </Space>
                </Space>
            </Form>
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resource: any) => handleSelectResource(resource)}   
                initialFilter           =   {[]}
            />
        </div>
    )
}

export default AddResourceForm
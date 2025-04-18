import { useContext, useState } from "react";
import { Button, Card, Form, Image, Input, Popconfirm, Space, Typography, message } from "antd";

import { useBuyerResourceViewer } from "../../../../custom-hooks/resource-viewer-hook";
import { Length_Input } from "../../../../constants/module-constants";
import { TemplateActionPointContext } from "./template-action-point";
import { RoomTemplateAgent } from "../../api/room-template-agent";
import { LibraryAgent } from "../../../library/api/library-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";

import SellerResourceViewerModal from "../../../resource-viewer/seller-resource-viewer-modal";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const { useForm }   =   Form;
const { Text }      =   Typography;

const EditActionPointResource = (_resource: any) => {

    const [form]    =   useForm();

    const [ editView, setEditView ]  =  useState(false);

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();
    
    const { actionPoint }           =   useContext(TemplateActionPointContext);

    const removeResourceActionPoint = (resourceId: string) => {
        const messageLoading = message.loading("Removing resource...");
        RoomTemplateAgent.removeActionPointResource({
            variables: {
                actionPointUuid :   actionPoint.uuid, 
                resourceUuid    :   resourceId
            },
            onCompletion: () => {
                messageLoading()
                CommonUtil.__showSuccess("Action point updated successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const updateResource = (resourceId: string) => {

        let values = form.getFieldsValue().title;

        if(!values.trim()){
            CommonUtil.__showError("Resource cannot be empty");
        }
        else{
            let input: any = {
                resourceUuid    :   resourceId,
                title           :   values,
            }

            LibraryAgent.updateResourceInfo({
                variables: input,
                onCompletion: () => {
                    setEditView(false)
                    CommonUtil.__showSuccess("Resource edited successfully")
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
            form.submit()
        }
    }
    
    return(
        <>
            <Card key={_resource.uuid} className='j-ap-uploaded-file cm-cursor-pointer' hoverable onClick={(event) => {event.stopPropagation(); handleResourceOnClick(_resource)}}>
                <Space className="cm-flex-space-between" style={{minHeight: "35px"}}>
                    <Space className='cm-flex-align-center'>
                        <Image className='j-ap-resource-thumbnail' preview={false} width={80} height={60} src={_resource.content.thumbnailUrl ? _resource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(_resource.content.type)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= CommonUtil.__getResourceFallbackImage(_resource.content.type)}}/> 
                        {
                            editView ?
                                <Form key={_resource.uuid} form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onClick={(event) => event.stopPropagation()}>
                                    <Space className="cm-flex-align-center">
                                        <Form.Item noStyle initialValue={_resource.title} name={"title"}>
                                            <Input style={{width: "250px"}} maxLength={Length_Input} className="cm-font-fam500 cm-font-size16"  placeholder="Untitled" onKeyDown={handleEnter}/>
                                        </Form.Item>
                                        <Form.Item noStyle initialValue={_resource.uuid} name={"id"} hidden>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item  noStyle>
                                            <Button size='small' type="primary" onClick={() => updateResource(_resource.uuid)}>
                                                <div className='cm-font-size12 cm-display-inline'>Save</div>
                                            </Button>
                                        </Form.Item>
                                        <Form.Item  noStyle>
                                            <Button className="cm-no-border-button" type="primary" size='small' ghost onClick={() => setEditView(false)}>
                                                <div className='cm-font-size12 cm-display-inline'>Cancel</div>
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </Form>
                            :
                                <Text style={{maxWidth: "270px"}} ellipsis={{tooltip: _resource.title}} className='cm-flex-align-center cm-font-size13 cm-font-fam400'>{_resource.title}</Text>
                        }
                    </Space>
                    <Space className='cm-flex-align-center' size={15} onClick={(event) => event.stopPropagation()}>
                        {/* <MaterialSymbolsRounded font="edit" size="16" className="cm-cursor-pointer" onClick={() => setEditView(true)}/> */}
                        <MaterialSymbolsRounded font="download" size="18" className='cm-cursor-pointer' onClick={(event: any) => {event?.stopPropagation(); window.open(_resource.content.downloadableUrl ? _resource.content.downloadableUrl : _resource.content.url, "_blank")}}/>
                        <Popconfirm
                            placement           =   "left"      
                            title               =   {<div className="cm-font-fam500">Remove resource</div>}
                            description         =   {<div className="cm-font-size13">Are you sure want to remove this resource?</div>}
                            icon                =   {null}
                            okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0"}, danger: true}}
                            cancelButtonProps   =   {{style: {fontSize: "12px"}, danger: true, ghost: true}}
                            okText              =   {"Remove"}
                            onConfirm           =   {() => removeResourceActionPoint(_resource.uuid)}
                        >
                            <MaterialSymbolsRounded font={'delete'} size={'18'} className='cm-cursor-pointer' onClick={(event) => event.stopPropagation()}/>
                        </Popconfirm>
                    </Space>
                </Space>
            </Card>
            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default EditActionPointResource
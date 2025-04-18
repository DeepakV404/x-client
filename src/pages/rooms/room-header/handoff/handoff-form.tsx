import { useState } from "react";
import { useParams } from "react-router-dom"
import { Button, Form, Space, Typography } from "antd";

import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { RoomsAgent } from "../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import HtmlEditor from "../../../../components/HTMLEditor";
import UploadedFile from "../../library/resource-form/uploaded-file";

const { useForm }   =   Form;
const { Text }      =   Typography;

const HandoffForm = (props: {onClose: () => void, option: any, room: any, owner?: any}) => {

    const { onClose, option, room, owner }   =   props;

    const [form]        =   useForm();
    const { roomId }    =   useParams();

    const [fileList, setFileList]                                       =   useState<any>([]);
    const [uploadedHandoffAttachment, setUploadedHandoffAttachment]     =   useState<any[]>([]);
    const [submitState, setSubmitState]                                 =   useState({
        text    :   "Update",
        loading :   false
    })

    const onFinish = (values: any) => {
        setSubmitState({
            text: "Updating",
            loading: true
        })
        if(option === "owner_update"){
            RoomsAgent.updateRoomOwner({
                variables: {
                    roomUuid    :   roomId, 
                    ownerUuid   :   owner?.uuid,
                    note        :   values.note,  
                    attachments :   uploadedHandoffAttachment
                },
                onCompletion: () => {
                    setSubmitState({
                        text: "Update",
                        loading: false
                    })
                    onClose()
                    CommonUtil.__showSuccess("Owner updated successfully")
                },
                errorCallBack: (error: any) => {
                    setSubmitState({
                        text: "Update",
                        loading: false
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{  
            RoomsAgent.updateRoomOwner({
                variables: {
                    roomUuid        :   roomId, 
                    ownerUuid       :   room?.owner?.uuid,
                    note            :   values.note,  
                    roomStageUuid   :   option.key,
                    attachments     :   uploadedHandoffAttachment
                },
                onCompletion: () => {
                    setSubmitState({
                        text: "Update",
                        loading: false
                    })
                    onClose()
                    CommonUtil.__showSuccess("Stage updated successfully")
                },
                errorCallBack: (error: any) => {
                    setSubmitState({
                        text: "Update",
                        loading: false
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        } 
    }

    // const handleChange = ({fileList}: any) => {

    //     RoomsAgent.attachBlob({
    //         variables: {
    //             title   : fileList[0].name,
    //             content : fileList[0].originFileObj
    //         }, 
    //         onCompletion: (data: any) => {
    //             if(data) setUploadedHandoffAttachment((prev) => [...prev, data])
    //         },
    //         errorCallBack: (error: any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error?.graphQLErrors[0].code] ? ERROR_CONFIG[error?.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     }) 
    //     setFileList(fileList)
    // };

    const handleRemove = (fileId: string) => {
        RoomsAgent.removeBlob({
            variables: {
                attachmentUuid: [fileId]
            }, 
            onCompletion: () => {
                setUploadedHandoffAttachment((prev) => prev.filter((attachment) => attachment.uid !== fileId));  
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error?.graphQLErrors[0].code] ? ERROR_CONFIG[error?.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        }) 
        setFileList((prevFileList: any) => prevFileList.filter((_file: any) => _file.uid !== fileId))
    }

    return (
        <div className="cm-width100">
            <Form form={form} onFinish={onFinish} layout="vertical" className="cm-form">
                <Space className="cm-flex-space-between cm-padding-inline15 cm-border-bottom cm-padding-bottom10">
                    {
                        option === "owner_update" ?
                            <Space direction="vertical" className="cm-margin-top10" size={2}>
                                <div className="cm-font-size16 cm-font-fam600">Would you like to change the room owner?</div>
                                <div>Room will be handed off {room?.owner ? "from" : ""} <span className="cm-font-fam500">{CommonUtil.__getFullName(room.owner?.firstName, room.owner?.lastName)}</span> to <span className="cm-font-fam500">{CommonUtil.__getFullName(owner?.firstName, owner.lastName)}</span></div>
                            </Space>
                        :
                            <Space direction="vertical" className="cm-margin-top10" size={2}>
                                <div className="cm-font-size16 cm-font-fam600">Update stage to {option.label}</div>
                                <div>Are you sure you want to update the rooms stage to <span className="cm-font-fam500">{option.label}</span>?</div>
                            </Space>
                    }
                    <MaterialSymbolsRounded font="close" size='22' className="cm-cursor-pointer" onClick={() => onClose()}/>
                </Space>
                <div>
                    <div className="cm-padding-inline15 cm-padding-top10" style={{minHeight: "270px", overflow: "auto", maxHeight: "calc(100vh - 230px)"}}>
                        {/* {
                            CommonUtil.__getSubdomain(window.location.origin) !== "hs-app" && option !== "owner_update" ?
                                <Form.Item name={"owner"} label={<div className="cm-secondary-text cm-font-size13">Owner</div>} initialValue={room.owner?.uuid} rules={[{required: true, message: "Owner is required"}]}>
                                    <Select 
                                        placeholder         =   {"Update owner"} 
                                        suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="20"/>} 
                                        notFoundContent     =   {<div className="cm-flex-center cm-light-text" style={{minHeight: "50px"}}>No sellers found</div>}
                                        optionFilterProp    =   "filter"
                                        optionLabelProp     =   "label"
                                        showSearch
                                        allowClear
                                    >
                                        {$sellers
                                            .filter(_seller => _seller.status !== "DELETED")
                                            .map((_seller: any) => (
                                                <Option key={_seller.uuid} label={CommonUtil.__getFullName(_seller.firstName, _seller.lastName)} filter={CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}>
                                                    <Space className="cm-padding5">
                                                        <SellerAvatar seller={_seller} size={25}/>
                                                        {CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}
                                                    </Space>
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            :
                                null
                        } */}
                        <Form.Item name={"note"} label={<div className="cm-secondary-text cm-font-size13">Handoff Note<span className="cm-font-size11">(Optional)</span></div>}>
                            <HtmlEditor />
                        </Form.Item>
                        {/* <Upload multiple maxCount={4} className="j-handoff-form" onChange={handleChange} fileList={fileList} showUploadList={false}>
                            <Button ghost type="primary" className="cm-icon-button cm-flex-align-center cm-font-size13" icon={<MaterialSymbolsRounded font='attach_file' size="16"/>}>Attachment</Button>
                        </Upload> */}
                        {
                            <div className="cm-margin-bottom15">
                                <div className="cm-margin-block10">
                                    {fileList.length > 0 && <Text className='cm-font-fam500 cm-font-size13'>Uploaded Files <span>({fileList.length})</span></Text> }
                                </div>
                                <Space direction="vertical" className="cm-width100" size={15}>
                                    {
                                        fileList.map((_file: any) => (
                                            <UploadedFile key={_file.uid} _file={_file} onRemove={(fileId) => handleRemove(fileId)} fileNameEditable={false}/>
                                        ))
                                    }
                                </Space>
                            </div>
                        }
                    </div>  
                </div>
                <Space className="cm-flex-justify-end cm-modal-footer">
                    <Form.Item noStyle>
                        <Button ghost className="cm-modal-footer-cancel-btn cm-secondary-text" onClick={() => onClose()}>Cancel</Button>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button loading={submitState.loading} disabled={submitState.loading} htmlType="submit" type="primary">{submitState.text}</Button>
                    </Form.Item>
                </Space>
            </Form>
        </div>
    )
}

export default HandoffForm
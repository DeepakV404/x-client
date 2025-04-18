import { useState } from "react";
import { Button, Col, Form, Input, Row, Space, Upload, UploadProps } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, Length_Input } from "../../../constants/module-constants";
import { AccountsAgent } from "../../accounts/api/accounts-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;

const UpdateBuyerProfile = (props: {onClose: any, buyer: any, onUpdateBuyer: any}) => {

    const { onClose, buyer, onUpdateBuyer }   =   props;

    const [form]                            =   useForm();

    const [submitState, setSubmitState]     =   useState({
        text: "Update",
        loading: false
    });
    const [imageUrl, setImageUrl]           =   useState<string>(buyer.profileUrl);

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        getBase64(info.file.originFileObj as RcFile, (url) => {
            setImageUrl(url);
        });
    };

    const onFinish = (values: any) => {

        setSubmitState({
            text    :  "Updating...",
            loading :   true
        })

        AccountsAgent.updateBuyerProfile({
            variables: {
                profile     : values.profilePic?.file,
                contactUuid : buyer.uuid,
                input: {
                    firstName   : form.getFieldsValue().firstName,
                    lastName    : form.getFieldsValue().lastName
                }
            },
            onCompletion: () => {
                setSubmitState({
                    text    :  "Update",
                    loading :   false
                })
                const updatedBuyer = {
                    ...buyer,
                    firstName: form.getFieldsValue().firstName,
                    lastName: form.getFieldsValue().lastName,
                    profileUrl: imageUrl
                };
                onUpdateBuyer(updatedBuyer);
                CommonUtil.__showSuccess("Account updated successfully")
                onClose()
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text    :  "Update",
                    loading :   false
                })
                onClose()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    // const handleRemoveImage = () => {
    //     AccountsAgent.removeBuyerProfileImage({
    //         variables: {
    //             contactUuid : buyer.uuid,
    //         },
    //         onCompletion: () => {
    //             CommonUtil.__showSuccess("Profile image removed successfully")
    //             setImageUrl("")
    //         },
    //         errorCallBack: (error: any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     })
    // }

    const uploadButton = (
        <div>
            <MaterialSymbolsRounded font="add" size="24"/>
            <div style={{ marginTop: 8 }}>
                Upload 
            </div>
        </div>
    );

  return (
    <>
        <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Update Buyer Profile</div>
        <Form className="cm-form cm-modal-content" form={form} onFinish={onFinish} layout="vertical">
            <Space>
                <Form.Item name={"profilePic"} initialValue={imageUrl} noStyle>
                    <Upload
                        name            =   "avatar"
                        listType        =   "picture-card"
                        showUploadList  =   {false}
                        onChange        =   {handleChange}
                        accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                        className       =   "cm-image-remove"
                    >
                        {imageUrl ? <img src={imageUrl} alt="logo" className="cm-height100 cm-width100 cm-border" style={{ borderRadius: "8px", objectFit: "scale-down" }} /> : uploadButton}
                        {/* {
                            imageUrl &&
                                <div onClick={(event) => {event.stopPropagation(); handleRemoveImage()}}>
                                    <MaterialSymbolsRounded font="close" className="cm-image-remove-close-icon" size="19" />
                                </div>
                        } */}
                    </Upload>        
                </Form.Item>
                <Space direction='vertical' size={5}>
                    <div className="cm-font-fam600 cm-font-size18">
                        {
                            CommonUtil.__getFullName(buyer.firstName, buyer.lastName).length > 25
                            ?
                                `${CommonUtil.__getFullName(buyer.firstName, buyer.lastName).slice(0, 25)}...`
                            :
                                CommonUtil.__getFullName(buyer.firstName, buyer.lastName)
                        }
                    </div>
                    <Space size={4} className="cm-light-text"><MaterialSymbolsRounded font="mail" filled size="18"/> <div>{buyer.emailId}</div></Space>
                </Space>
            </Space>
            <Row gutter={8} className="cm-margin-top10">
                <Col span={12}>
                    <Form.Item
                        initialValue    =   {buyer.firstName}
                        label           =   "First Name"
                        name            =   "firstName"
                        rules           =   {[
                            {required: true, message: "Enter a valid name", whitespace: true},
                        ]}
                    >
                        <Input size="large" maxLength={Length_Input} autoFocus allowClear={true} placeholder="Jane" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        initialValue    =   {buyer.lastName}
                        label           =   "Last Name"
                        name            =   "lastName"
                    >
                        <Input size="large" maxLength={Length_Input} allowClear = {true} placeholder="Doe" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item 
                name            =   "emailId" 
                label           =   "Email" 
                initialValue    =   {buyer.emailId}
            >
                <Input size="large" type="email" maxLength={Length_Input} placeholder="jane@humbird.ai" disabled/>
            </Form.Item>
        </Form>
        <div className='j-add-res-form-footer'>
            <Space>
                <Button type='primary' ghost onClick={() => onClose()}>Cancel</Button>
                <Button type="primary" className="cm-flex-center" onClick={() => form.submit()}>
                    <Space size={10}>
                        {submitState.text}
                        {submitState.loading && <Loading color="#fff" size='small' />}
                    </Space>
                </Button>
            </Space>
        </div>
    </>
  )
}
export default UpdateBuyerProfile
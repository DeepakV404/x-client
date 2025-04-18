import { FC, useContext, useState } from "react";
import { Form, Space, Upload, Input, Button, Row, Col} from "antd";
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadChangeParam } from 'antd/es/upload';

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, Length_Input } from "../../../constants/module-constants";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Translate from "../../../components/Translate";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;

interface UpdateProfileFormProps
{
    isOpen  :   boolean;
    onClose :   () => void;
}

const UpdateProfileForm: FC <UpdateProfileFormProps> = (props) => {

    const { onClose }   =   props;

    const [form]                            =   useForm();

    const { $buyerData }                    =   useContext(BuyerGlobalContext); 
    
    let $currentBuyer                       =   $buyerData?.buyers.filter((_buyer) => _buyer.isCurrentBuyer)[0];
    
    const [imageUrl, setImageUrl]           =   useState<string | null>($currentBuyer?.profileUrl);

    const [submitState, setSubmitState]     =   useState(false);

    const [profileInfo, setProfileInfo]     =   useState({
        firstName   :   $currentBuyer?.firstName,
        lastName    :   $currentBuyer?.lastName
    })

    const handleFirstNameChange = (event: any) => {
        setProfileInfo({
            firstName   :   event.target.value,
            lastName    :   profileInfo.lastName
        })
    }

    const handleLastNameChange = (event: any) => {
        setProfileInfo({
            firstName   :   profileInfo.firstName,
            lastName    :   event.target.value
        })
    }

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

        let input: any = {
            firstName   :   values.firstName,
            lastName    :   values.lastName,
        }

        const name = form.getFieldsValue().firstName;

        if(!name.trim()){
            CommonUtil.__showError("Name is required");
        }

        else{
            setSubmitState(true)

            BuyerAgent.updateBuyerProfile({
                variables   :   {
                    profile :   values.profilePic?.file,
                    input   :   input
                },
                onCompletion: () => {
                    onClose()
                    setSubmitState(false)
                    CommonUtil.__showSuccess(<Translate i18nKey="success-message.profile-update-message" />);                
                },
                errorCallBack: (error: any) => {
                    setSubmitState(false)
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const uploadButton = (
        <div>
            <MaterialSymbolsRounded font="add" size="24"/>
            <div style={{ marginTop: 8 }}>
                <Translate i18nKey={"common-labels.upload"}/> 
            </div>
        </div>
    );

    // const handleRemoveImage = () => {
    //     BuyerAgent.removeBuyerProfileImage({
    //         variables: {
    //         },
    //         onCompletion: () => {
    //             CommonUtil.__showSuccess("Profile image removed successfully");
    //             setImageUrl(null);
    //             form.setFieldsValue({ profilePic: null });
    //         },
    //         errorCallBack: () => {}
    //     })
    // }

    return(
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center"><Translate i18nKey={"profile.update-profile"}/></div>
            <Form className="cm-form cm-modal-content" form={form} onFinish={onFinish} layout="vertical">
                <Space>
                    <Form.Item name={"profilePic"} initialValue={imageUrl ?? null} noStyle>
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
                                CommonUtil.__getFullName(profileInfo.firstName, profileInfo.lastName).length > 25
                                ?
                                    `${CommonUtil.__getFullName(profileInfo.firstName, profileInfo.lastName).slice(0, 25)}...`
                                :
                                    CommonUtil.__getFullName(profileInfo.firstName, profileInfo.lastName)
                            }
                        </div>
                        <Space size={4} className="cm-light-text"><MaterialSymbolsRounded font="mail" filled size="18"/> <div>{$currentBuyer?.emailId}</div></Space>
                    </Space>
                </Space>
                <Row gutter={8} className="cm-margin-top10">
                    <Col span={12}>
                        <Form.Item
                            initialValue    =   {$currentBuyer?.firstName}
                            label           =   {<Translate i18nKey={"common-labels.first-name"}/>}
                            name            =   "firstName"
                            rules           =   {[
                                {required: true, message: "Enter a valid name", whitespace: true},
                            ]}
                        >
                            <Input size="large" maxLength={Length_Input} autoFocus allowClear={true} placeholder="Jane" onChange={(event) => handleFirstNameChange(event)}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            initialValue    =   {$currentBuyer?.lastName}
                            label           =   {<Translate i18nKey={"common-labels.last-name"}/>}
                            name            =   "lastName"
                        >
                            <Input size="large" maxLength={Length_Input} allowClear = {true} placeholder="Doe" onChange={(event) => handleLastNameChange(event)}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item 
                    name            =   {"emailId"} 
                    label           =   {<Translate i18nKey={"common-labels.email"}/>} 
                    initialValue    =   {$currentBuyer?.emailId}
                >
                    <Input size="large" type="email" maxLength={Length_Input} placeholder="jane@humbird.ai" disabled/>
                </Form.Item>
            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text">
                                <Translate i18nKey={"common-labels.cancel"}/>
                            </div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" className={`cm-flex-center cm-cancel-btn ${submitState? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState}>
                        <Space size={10}>
                            <div className="cm-font-size14">
                                <Translate i18nKey={submitState ? "common-labels.updating" : "common-labels.update"}/>
                            </div>
                            {
                                submitState && <Loading color="#fff"/>
                            }
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
        </>
    );
}

export default UpdateProfileForm
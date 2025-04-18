import { useState } from "react";
import { Button, Form, Input, Space, Typography } from "antd";

import { Length_Input } from "../../../constants/module-constants";
import { VendorAgent } from "../api/vendor-agent";

import Loading from "../../../utils/loading";
import { CommonUtil } from "../../../utils/common-util";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import { ERROR_CONFIG } from "../../../config/error-config";

const { useForm }   =   Form;
const {Text}        =   Typography

const AddVendorForm = (props: {onClose: () => void}) => {

    const { onClose }   =   props;

    const [form]    =     useForm();

    // const [logoLoading, setLogoLoading] =   useState(false);
    // const [currentUrl, setCurrentUrl]   =   useState("notFound");
    const [submitState, setSubmitState] =   useState({
        text: "Add Vendor",
        loading: false
    });

    const [proceedState, setProceedState] =   useState({
        text: "Yes, Proceed",
        loading: false
    });


    const [isEmailIdAlreadyExit, setIsEmailIdAlreadyExit]   =   useState<boolean>(false)
    const [enteredEmailId, setEnteredEmailId]               =   useState(null)

    const handleEmailIdAlreadyExitCase = () => {
        setProceedState({
            text: "Adding",
            loading: true
        })
        VendorAgent.markUserAsVendor({
            variables: {
                emailId : enteredEmailId
            },
            onCompletion: () => {
                setProceedState({
                    text: "Yes, Proceed",
                    loading: false
                })
                CommonUtil.__showSuccess("Vendor added successfully");
                onClose();
            },
            errorCallBack: (error: any) => { 
                setProceedState({
                    text: "Yes, Proceed",
                    loading: false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)                          
            }
        })
    }

    const onFinish = (values: any) => {
        setSubmitState({
            text: "Adding",
            loading: true
        })
        VendorAgent.createVendor({
            variables: {
                input: {
                    emailId    :    values.vendorEmail,
                    password   :    values.password
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Vendor added successfully");
                onClose();
            },
            errorCallBack: (error: any) => { 
                setEnteredEmailId(values.vendorEmail)
                setSubmitState({
                    text: "Add",
                    loading: false
                })
                if(error.graphQLErrors[0].code === 1008) {
                    setIsEmailIdAlreadyExit(true)
                }
                else
                {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            }
        })
    }

    return(
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Add Vendor</div>
            <Form
                form        =   {form}
                layout      =   "vertical"
                className   =   'cm-form cm-modal-content'
                onFinish    =   {onFinish}
            >
                {isEmailIdAlreadyExit 
                ? 
                    <Space size={20} direction="vertical" className="cm-flex-center cm-text-align-center">
                        <Text className="cm-font-fam500 cm-font-size24 cm-text-align-center cm-margin-bottom20 cm-font-opacity-black-85">This user is already using Buyerstage. <br /> Do you want to add this user as a vendor?</Text>
                        <div className="cm-font-fam500 cm-border-radius4 cm-flex-align-center cm-cursor-pointer" style={{opacity: "85%", padding: "8px", border: "1px solid #E8E8EC"}} onClick={() => setIsEmailIdAlreadyExit(false)}>
                            <div>{enteredEmailId}</div>
                            <div className="cm-margin-left10"><MaterialSymbolsRounded font={"edit"} size="16"/></div>
                        </div>
                    </Space>
                :   
                    <>
                        <Form.Item label="Vendor Email" name="vendorEmail"
                            rules       =   {[{
                                required    :   true,
                                message     :   "Email is required",
                                whitespace  :   true
                            }]}
                        >
                            <Input allowClear maxLength={Length_Input} placeholder="Vendor email" size="large"/>
                        </Form.Item>

                        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter password"}]}>
                            <Input.Password placeholder="Enter password" size="large"/>
                        </Form.Item>
                    </>
                }

            </Form>
            
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn" disabled={submitState.loading && !enteredEmailId} onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text">{isEmailIdAlreadyExit ? "No, Cancel" : "Cancel"}</div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    {
                        !isEmailIdAlreadyExit 
                            ?   
                                <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                                    <Space size={10}>
                                        <div className="cm-font-size14">{submitState.text}</div>
                                        {
                                            submitState.loading && <Loading color="#fff"/>
                                        }
                                    </Space>
                                </Button>
                            :
                                <Button type="primary" className={`cm-flex-center ${proceedState.loading ? "cm-button-loading" : ""}`} onClick={handleEmailIdAlreadyExitCase} disabled={proceedState.loading}>
                                    <Space size={10}>
                                        <div className="cm-font-size14">{proceedState.text}</div>
                                        {
                                            proceedState.loading && <Loading color="#fff"/>
                                        }
                                    </Space>
                                </Button>
                    }
                </Form.Item>
            </Space>
        </>
    )
}

export default AddVendorForm
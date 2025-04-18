import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputRef, Space } from "antd";

import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { LibraryAgent } from "../api/library-agent";

import CustomFormSubmitButton from "../../../components/custom-submit-button/custom-form-submit-button";

const { useForm }   =   Form;

const NewFolderForm = (props: {onClose:  () => void, parentFolderId?: string}) => {

    const { onClose, parentFolderId }   =   props;

    const [form]        =   useForm();
    const inputRef      =   useRef<InputRef>(null);

    const [submitState, setSubmitState] =   useState({
        loading     :   false,
        text        :   "Create"
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const createFolder = (values: any) => {
        setSubmitState({
            loading :   true,
            text    :   "Creating"
        })
        LibraryAgent.createFolder({
            variables: {
                title:  values.folderName,
                parentFolderUuid:   parentFolderId
            },
            onCompletion: () => {
                setSubmitState({
                    loading :   false,
                    text    :   "Create"
                })
                CommonUtil.__showSuccess("Folder created successfully");
                onClose();
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    loading :   false,
                    text    :   "Create"
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return(
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Create New Folder</div>
            <Form form={form} className="cm-form cm-modal-content" layout="vertical" onFinish={createFolder}>
                <Form.Item name={"folderName"} label={"Folder Name"} rules={[{required: true, message: "Folder name is required."}]}>
                    <Input ref={inputRef} placeholder="Folder Name" size="large"/>
                </Form.Item>
            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" onClick={() => onClose()}>
                        <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                    </Button>
                </Form.Item>
                <CustomFormSubmitButton form={form} submitState={submitState}/>
            </Space>
        </>
    )
}

export default NewFolderForm
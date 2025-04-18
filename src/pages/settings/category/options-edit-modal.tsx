import { FC, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button, Form, Input, InputRef, Modal, Popover, Space } from "antd";

import { Length_Input } from "../../../constants/module-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";

import Loading from "../../../utils/loading";

const { useForm }   =   Form;

interface EditResourceFormProps {
    isOpen  :   boolean;
    onClose :   () => void;
    type    :   { name: string, op: string }
    currentResourceCategory: any;
}

const OptionsEditModal: FC<EditResourceFormProps> = (props) => {

    const { onClose, currentResourceCategory, type, isOpen } = props;

    const colorInputRef     =   useRef<InputRef>(null);

    const [color, setColor]             =   useState<string>(currentResourceCategory?.properties?.color ?? "#DCDCDC");
    const [submitState, setSubmitState] = useState({
        text: "Update",
        loading: false
    });

    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

    const [form] = useForm();

    useEffect(() => {
        if (type.name === "room_stage" && currentResourceCategory?.properties?.color) {
            setColor(currentResourceCategory.properties.color);
        }
    }, [type.name, currentResourceCategory]);

    const onFinish = (values: any) => {

        const onComplete = () => {
            onClose()
            CommonUtil.__showSuccess(`${getProperty()?.label} updated successfully`)
            setSubmitState({
                loading: false,
                text: "Update"
            })
        }

        const onError = (error: any) => {
            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            setSubmitState({
                loading: false,
                text: "Update"
            })
        }

        setSubmitState({
            loading: true,
            text: "Updating..."
        })

        if (type.name === "Resource") {
            SettingsAgent.updateResourceCategory({
                variables: {
                    uuid: currentResourceCategory.uuid,
                    name: values.name
                },
                onCompletion: () => {
                    onComplete()
                },
                errorCallBack: (error: any) => {
                    onError(error)
                }
            })
        } else if (type.name === "Usecase") {
            SettingsAgent.updateUsecaseCategory({
                variables: {
                    uuid: currentResourceCategory.uuid,
                    name: values.name
                },
                onCompletion: () => {
                    onComplete()
                },
                errorCallBack: (error: any) => {
                    onError(error)
                }
            })
        }else if (type.name === "room_stage") {
            SettingsAgent.updateRoomStage({
                variables: {
                    roomStageUuid   :  currentResourceCategory.uuid,
                    roomStageInput  :  {
                        label   :   values.name,
                            properties : {
                                color  :  color
                            }
                    } 
                },
                onCompletion: () => {
                    onComplete()
                },
                errorCallBack: (error: any) => {
                    onError(error)
                }
            })
        } else {
            SettingsAgent.updateRegion({
                variables: {
                    uuid: currentResourceCategory.uuid,
                    name: values.name
                },
                onCompletion: () => {
                    onComplete()
                },
                errorCallBack: (error: any) => {
                    onError(error)
                }
            })
        }
    }

    const getProperty = (): { title: string; label: string; placeholder: string } | null => {
        switch (type.name) {
            case "Region":
                return {
                    title: "Edit Region",
                    label: "Region",
                    placeholder: "Eg: US, IN, etc."
                }
            
            case "Resource": 
                return {
                    title: "Edit Resource Category",
                    label: "Resource Category",
                    placeholder: "Eg: Marketing Collateral, etc."
                }

            case "Usecase": 
                return {
                    title: "Edit Usecase Category",
                    label: "Use case Category",
                    placeholder: "Eg: Collaboration, etc."
                }

            case "room_stage": 
                return {
                    title: "Edit Room Stage",
                    label: "Room Stage",
                    placeholder: "Eg: In-Sales, Sales Development, etc."
                }
            
            default:
                return null
                
        }
    }


    return (
        <Modal
            centered
            destroyOnClose
            width           =   {500}
            open            =   {isOpen}
            onCancel        =   {onClose}
            footer          =   {null}
            className       =   'cm-bs-custom-modal'
        >
            <>
                <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">{getProperty()?.title}</div>
                <Form layout="vertical" className='cm-form cm-modal-content' form={form} onFinish={onFinish} preserve={false}>
                    <Form.Item label={getProperty()?.label} name="name" rules={[{ required: true, message: `${getProperty()?.label} is required`, whitespace: true }]} initialValue={ type.name === "room_stage" ? currentResourceCategory?.label : currentResourceCategory?.name}>
                        <Input ref={inputRef} size="large" maxLength={Length_Input} placeholder="Eg: Collaboration" allowClear />
                    </Form.Item>

                    {
                        type.name === "room_stage" ?
                            <Space className="cm-flex-space-between cm-margin-block20">
                                <div>Pick a color for your stage</div>
                                <Space>
                                    <Popover
                                        content =   {<HexColorPicker color={color} onChange={(color) => setColor(color)} />}
                                        trigger =   {["click"]}
                                    >
                                        <div 
                                            className       =   {"j-stage-color-picker-trigger"}
                                            style           =   {{background: `${color ?? "#DCDCDC"}4D`, border: `1px solid ${color ?? "#000"}`}}
                                        ></div>
                                    </Popover>
                                    <Input
                                        ref             =   {colorInputRef}
                                        value           =   {color}
                                        style           =   {{width: "80px", borderRadius: "6px"}}
                                        onChange        =   {(event) => setColor(event.target.value)}
                                        placeholder     =   "#ff8b8b"
                                    />
                                </Space>
                            </Space>
                        :
                            null
                    }
                </Form>
                <Space className="cm-flex-justify-end cm-modal-footer">
                    <Form.Item noStyle>
                        <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" disabled={submitState.loading} onClick={() => onClose()}>
                            <Space size={10}>
                                <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                            </Space>
                        </Button>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button type="primary" className={`cm-flex-center cm-cancel-btn ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                            <Space size={10}>
                                <div className="cm-font-size14">{submitState.text}</div>
                                {
                                    submitState.loading && <Loading color="#fff" />
                                }
                            </Space>
                        </Button>
                    </Form.Item>
                </Space>
            </>
        </Modal>
    )
}

export default OptionsEditModal
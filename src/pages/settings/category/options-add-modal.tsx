import { Button, Form, Input, InputRef, Modal, Popover, Space } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { Length_Input } from "../../../constants/module-constants";
import { SettingsAgent } from "../api/settings-agent";
import { CommonUtil } from "../../../utils/common-util";
import { CATEGORIES_ADDED } from "../../../tracker-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { AppTracker } from "../../../app-tracker";


import Loading from "../../../utils/loading"
import { HexColorPicker } from "react-colorful";

const { useForm }   =   Form;

interface OptionModalProps {
    isOpen  :   boolean;
    onClose :   () => void;
    type    :   { name: string, op: string };
}

const OptionsAddModal: FC<OptionModalProps> = (props) => {

    const { isOpen, onClose, type } = props;

    const inputRef      =   useRef<InputRef>(null);
    const colorInputRef =   useRef<InputRef>(null);

    const [submitState, setSubmitState] = useState({
        text    :   "Create",
        loading :   false
    });
    
    const [form] = useForm();

    const [color, setColor] =   useState<string>("#DCDCDC");

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);


    const onFinish = (values: any) => {

        const onCompletion = () => {
            onClose()
            CommonUtil.__showSuccess(`${getProperty()?.label} created successfully`)
            setSubmitState({
                loading: false,
                text: "Create"
            })
            AppTracker.trackEvent(CATEGORIES_ADDED, { "Option name": values.name });
        }

        const onError = (error: any) => {
            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            setSubmitState({
                loading: false,
                text: "Create"
            })
        }

        setSubmitState({
            loading: true,
            text: "Creating..."
        })

        if (type.name === "Resource") 
        {
            SettingsAgent.createResourceCategory({
                variables: {
                    name: values.name
                },
                onCompletion: () => {
                    onCompletion()
                },
                errorCallBack: (error: any) => {
                    onError(error)
                }
            })
        } 
        else if (type.name === "Usecase") 
        {
            SettingsAgent.createUsecaseCategory({
                variables: {
                    name: values.name
                },
                onCompletion: () => {
                    onCompletion()
                },
                errorCallBack: (error: any) => {
                    onError(error)
                }
            })
        } 
        else if (type.name === "room_stage") 
            {
                SettingsAgent.createRoomStage({
                    variables: {
                        roomStageInput : {
                            label   :   values.name,
                            properties : {
                                color  :  color
                            }
                        }
                    },
                    onCompletion: () => {
                        onCompletion()
                    },
                    errorCallBack: (error: any) => {
                        onError(error)
                    }
                })
            } 
        else 
        {
            SettingsAgent.createRegion({
                variables: {
                    name: values.name
                },
                onCompletion: () => {
                    onClose()
                    setSubmitState({
                        loading: false,
                        text: "Create"
                    })
                },
                errorCallBack: () => {
                    onClose()
                    setSubmitState({
                        loading: false,
                        text: "Create"
                    })
                }
            })
        }
    }

    const getProperty = (): { title: string; label: string; placeholder: string } | null => {
        switch (type.name) {
            case "Region":
                return {
                    title: "Create Region",
                    label: "Region",
                    placeholder: "Eg: US, IN, etc."
                }
            
            case "Resource": 
                return {
                    title: "Create Resource Category",
                    label: "Resource Category",
                    placeholder: "Eg: Marketing Collateral, etc."
                }

            case "Usecase": 
                return {
                    title: "Create Usecase Category",
                    label: "Use Case Category",
                    placeholder: "Eg: Collaboration, etc."
                }

            case "room_stage": 
                return {
                    title: "Create Room Stage",
                    label: "Room Stage",
                    placeholder: "Eg: In-Sales, Sales Development, etc."
                }
            
            default:
                return null
                
        }
    }

    useEffect(() => {
        if(colorInputRef?.current?.input){
            colorInputRef.current.input.value = color;
        }
    }, [color])

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
                <Form
                    autoFocus
                    layout      =   "vertical"
                    className   =   'cm-form cm-modal-content'
                    form        =   {form}
                    onFinish    =   {onFinish}
                    preserve    =   {false}
                >
                    <Form.Item name="name" label={getProperty()?.label} rules={[{ required: true, message: `${getProperty()?.label} is required`, whitespace: true }]} >
                        <Input autoFocus ref={inputRef} size="large" maxLength={Length_Input} placeholder={getProperty()?.placeholder} allowClear />
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
                                    style           =   {{width: "80px", borderRadius: "6px"}}
                                    value           =   {color}
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

export default OptionsAddModal
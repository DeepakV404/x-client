import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, DatePicker, Divider, Form, Input, Select, Space, Switch, Tooltip, Typography } from 'antd';

import { LibraryAgent } from '../../api/library-agent';
import { CommonUtil } from '../../../../utils/common-util';
import { ERROR_CONFIG } from '../../../../config/error-config';

import CustomFormSubmitButton from '../../../../components/custom-submit-button/custom-form-submit-button';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import useEnterKeyHook from '../../../../custom-hooks/enter-key-press-hook';
import dayjs from 'dayjs';

const { useForm }   =   Form;
const { Text }      =   Typography
const { Option }    =   Select

const EditDeckForm = (props: {onClose: any, resources?: any, editDeck: any}) => {

    const { onClose,  editDeck } = props;

    const [form]    =   useForm();

    const [submitState, setSubmitState]             =   useState({
        loading :   false,
        text    :   "Save",
    })
    const [isLinkEnabled, setLinkEnabled]               =   useState<boolean>(editDeck?.deckData?.deck?.isDeckEnabled)
    const [expiryChecked, setExpiryChecked]             =   useState(!!editDeck?.deckData?.deck?.settings?.expirationDate);
    
    const inputRef = useRef<any>(null)

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    }, [])

    const onFinish = (values: any) => {
        
        const updatedSettings = {
            ...editDeck.deckData.deck.settings,
            allowDownloads: values.allowDownload ?? editDeck.deckData.deck.settings.allowDownloads,
            deckType: editDeck.deckData.deck.settings.deckType,
            expirationDate: values.expirationDate ? dayjs(values.expirationDate).valueOf() : editDeck.deckData.deck.settings.expirationDate,
        };

        setSubmitState({
            loading: true,
            text: "Saving"
        })
        LibraryAgent.updateDeck({
            variables: {
                deckUuid        :   editDeck?.deckData?.deck?.uuid,
                input           :   {
                    title       :   values.title,
                    type        :   values.linkAccess,
                    settings    :   updatedSettings,
                    enableLink  :   isLinkEnabled
               }
            },
            refetch: true,
            onCompletion: () => {
                onClose()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    useEnterKeyHook(form.submit);

    const disabledDate = (current: any) => {
        const currentDate = dayjs();        
        return current && current < currentDate.startOf('day');
    }

    return (
        <>
            <Space className="cm-flex-space-between cm-padding15">
                <span className="cm-font-size16 cm-font-fam500">{editDeck?.action} Link</span>
                <MaterialSymbolsRounded font="close" className="cm-cursor-pointer" onClick={onClose}/>
            </Space>
            <Divider style={{margin: "0px"}}/>
            <Form
                form        =   {form} 
                layout      =   'vertical' 
                className   =   'cm-form cm-padding15 cm-overflow-auto'
                onFinish    =   {onFinish}
                style       =   {{height: "calc(100% - 116px)"}}
            >
                <Form.Item name={"title"} label={<div className='cm-font-opacity-black-85'>Title</div>} rules={[{required: true, message: "Enter a title for your link"}]} initialValue={editDeck?.deckData?.deck?.title || ""}>
                    <Input placeholder='Eg: Marketing Collateral' size='large' ref={inputRef}/>
                </Form.Item>

                <Space direction='vertical' className='cm-width100 cm-margin-top20'>
                    <Text className='cm-font-fam500'>Manage Link Access</Text>
                    <Space size={4}>
                        <div className='cm-font-opacity-black-85 cm-font-size13'>Who can access</div>
                        <Tooltip title={<span>The link will remain the same even if room sharing permissions are changed.</span>}>
                            <div><MaterialSymbolsRounded font='info' size='16' className='cm-cursor-pointer'/></div>
                        </Tooltip>
                    </Space>
                    <Form.Item name="linkAccess" initialValue={editDeck?.deckData?.deck?.type}>
                        <Select
                            suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                            style               =   {{width: "100%"}}
                            optionLabelProp     =   "label"
                            defaultValue        =   {"PUBLIC"}
                            onChange            =   {(value) => {form.setFieldsValue({ linkAccess: value })}}
                        >
                            <Option
                                key     =   {"PUBLIC"}
                                label   =   {
                                    <Space className='cm-flex-align-center'>
                                        <MaterialSymbolsRounded font="language" size='18'color='#000000a6'/>
                                        Anyone with this link
                                    </Space>
                                }
                            >
                                <div className="cm-flex-align-center" style={{height: "45px"}}>
                                    <Space className='cm-flex-align-start'>
                                        <MaterialSymbolsRounded font="language" size='20' color='#000000a6'/>
                                        <Space direction='vertical' size={0}>
                                            Anyone with this link
                                            <div className='cm-font-size12 cm-font-opacity-black-65'>Anyone can enter the room without restriction</div>
                                        </Space>
                                    </Space>
                                </div>
                            </Option>
                            <Option
                                key     =   {"EMAIL_PROTECTED"}
                                label   =   {
                                    <Space className='cm-flex-align-center'>
                                        <MaterialSymbolsRounded font="alternate_email" size='18' color='#000000a6'/>
                                        Required email address
                                    </Space>
                                }
                            >
                                <div className="cm-flex-align-center" style={{height: "45px"}}>
                                    <Space className='cm-flex-align-start cm-width100'>
                                        <MaterialSymbolsRounded font="alternate_email" size='20' color='#000000a6'/>
                                        <Space direction='vertical' size={0}>
                                            Required email address
                                            <div className='cm-font-size12 cm-font-opacity-black-65'>Viewer must enter the mail id to access the link</div>
                                        </Space>
                                    </Space>
                                </div>
                            </Option>
                            <Option
                                key     =   {"OTP_PROTECTED"}
                                label   =   {
                                    <Space className='cm-flex-align-center'>
                                        <MaterialSymbolsRounded font="lock" size='18' color='#000000a6'/>
                                        Protected
                                    </Space>
                                }
                                disabled    =   {false}
                            >
                                <div className="cm-flex-align-center" style={{height: "45px"}}>
                                    <Space className='cm-flex-space-between cm-width100'>
                                        <Space className='cm-flex-align-start'>
                                            <MaterialSymbolsRounded font="lock" size='20' color='#000000a6'/>
                                            <Space direction='vertical' size={0}>
                                                Protected
                                                <div className='cm-font-size12 cm-font-opacity-black-65'>Only invited people can access with email verification</div>
                                            </Space>
                                        </Space>
                                    </Space>
                                </div>
                            </Option>
                        </Select>
                    </Form.Item>

                </Space>
                <div className='cm-margin-top20 cm-margin-bottom10 cm-font-fam500 cm-font-opacity-black-85'>Link Settings</div>
                <Form.Item name="allowDownload" valuePropName="checked" initialValue={editDeck?.deckData?.deck?.settings?.allowDownloads}>
                    <Checkbox onChange={(e) => {form.setFieldsValue({ allowDownload: e.target.checked })}} className='cm-flex-align-center'><Space className='cm-margin-left5 cm-flex-center'>Allow Download</Space></Checkbox>
                </Form.Item>
                <Form.Item name="expiryChecked" valuePropName="checked" initialValue={!!editDeck?.deckData?.deck?.settings?.expirationDate}>
                    <Checkbox className='cm-flex-align-center' onChange={(e) => {form.setFieldsValue({ expiryChecked: e.target.checked }); setExpiryChecked((prev: boolean) => !prev)}}><Space className='cm-margin-left5 cm-flex-center'>Set Expiry Date</Space></Checkbox>
                </Form.Item>
                {expiryChecked && (
                    <Form.Item name="expirationDate" rules={[{ required: true, message: "Please select an expiry date" }]} initialValue={editDeck?.deckData?.deck?.settings?.expirationDate ? dayjs(editDeck?.deckData?.deck?.settings?.expirationDate) : undefined}>
                        <DatePicker style={{ width: "200px", marginTop: "10px" }} placeholder="Select Date" disabledDate={disabledDate} className="cm-cursor-pointer cm-margin-left25" allowClear={true} suffixIcon={<MaterialSymbolsRounded font="calendar_month" size="18" color="#000" />} />
                    </Form.Item>
                )}
                <Space size={1} direction='vertical' className='cm-width100 cm-margin-top20'>
                    <Space className='cm-flex-space-between'>
                        <Text className='cm-font-fam500'>Link Accessibility</Text>
                        <Switch onChange={() => setLinkEnabled((prev) => !prev)} checked={isLinkEnabled}/>
                    </Space>
                    <Text className='cm-font-size13'>By disabling this user can't access this link anymore</Text>
                </Space>
            </Form>
            <div className='j-demo-form-footer'>
                <Space>
                    <Button className="cm-cancel-btn" ghost onClick={() => onClose()}><div className="cm-font-size14 cm-secondary-text">Cancel</div></Button>
                    <CustomFormSubmitButton form={form} submitState={submitState}/>
                </Space>
            </div>
        </>
    )
}

export default EditDeckForm
import { useEffect, useRef, useState } from 'react';
import { Button, Divider, Form, Input, Space } from 'antd';

const { TextArea }  =   Input;
const { useForm }   =   Form;

interface DeckLinkModalProps {
    isInProduct :   boolean
    isOpen      :   boolean;
    onClose     :   () => void;
    link        :   string;
}

const DeckCopyLinkForm = (props: DeckLinkModalProps) => {
    
    const { isOpen, link, isInProduct } = props;

    const inputRef  =   useRef<any>(null);
    const [form]    =   useForm();  

    const [copied, setCopied]           =   useState(false);

    const [tempLink, setTempLink]       =   useState(link);

    useEffect(() => {
        form.setFieldsValue({
            ["finalLink"]    :  tempLink
        })
    }, [tempLink, link, form])

    useEffect(() => {
        if(!isInProduct){
            setTimeout(() => {
                inputRef?.current?.focus({
                    cursor: 'all',
                });
            }, 100);
        }
    }, [isOpen]);

    const onFinish = (values: any) => {
        let newLink = `${link}${values.reference ? `?bs_email=${encodeURIComponent(values.reference)}` : ""}`;
        window.navigator.clipboard.writeText(newLink)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000);
    }

    const handleRefChange = (event: any) => {
        setTempLink(`${link}${event.target.value ? `?bs_email=${encodeURIComponent(event.target.value)}` : ""}`)
    }

    return (
        <>
            <Space className="j-link-modal-content" direction='vertical' size={15}>
                <div className="cm-flex-align-center cm-font-size16 cm-font-fam600">Copy Link</div>
                {
                    isInProduct ?
                        <Form form={form} layout='vertical' className='cm-form' onFinish={onFinish}>
                            <Form.Item name={"reference"} label={<div>Tracking reference <span className='cm-font-size11 cm-font-opacity-black-65'>(optional)</span></div>} extra={<div className='cm-font-size12 cm-font-opacity-black-85 cm-margin-top5'>This reference will be included in the link to help track engagements and analytics.</div>}>
                                <Input size='large' placeholder='e.g., johnsmith@acmeinc.com, SEP-event'/>
                            </Form.Item>
                            <Form.Item noStyle>
                                <Button htmlType='submit' type='primary' block>{copied ? "Copied" : "Copy Link"}</Button>
                            </Form.Item>
                        </Form>
                    :
                        <>
                            <Form form={form} layout='vertical' className='cm-form' onFinish={onFinish}>
                                <Form.Item name={"reference"} label={<div className='cm-font-opacity-black-65'>Tracking reference <span className='cm-font-size11'>(optional)</span></div>} extra={<div className='cm-font-size12 cm-font-opacity-black-85 cm-margin-top5'>This reference will be included in the link to help track engagements and analytics.</div>}>
                                    <Input onChange={handleRefChange} size='large' placeholder='e.g., johnsmith@acmeinc.com, SEP-event'/>
                                </Form.Item>
                                <Divider/>
                                <Form.Item name={"finalLink"} >
                                    <TextArea
                                        readOnly
                                        ref             =   {inputRef}
                                        className       =   "j-copy-buyer-link cm-padding15"
                                        style           =   {{
                                            height: "auto",
                                            resize: "none"
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        </>
                }
            </Space>
        </>
    );
}

export default DeckCopyLinkForm;

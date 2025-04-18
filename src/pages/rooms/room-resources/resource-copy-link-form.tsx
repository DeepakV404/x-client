
import { useEffect, useRef } from 'react';
import { Form, Input } from 'antd';

const { TextArea }  =   Input;
const { useForm }   =   Form;

const ResourceCopyLinkForm = (props: {link: any}) => {

    const { link }  =   props;

    const [form]    =   useForm();

    const inputRef  =   useRef<any>(null);

    useEffect(() => {
        setTimeout(() => {
            inputRef?.current?.focus({
                cursor: 'all',
            });
        }, 100);
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            ["finalLink"]    :  link
        })
    }, [link])

    return (
        <div className='cm-modal-content'>
            <div className="cm-flex-align-center cm-margin-bottom15">
                <div className="cm-font-fam500 cm-font-size16">Copy Resource Link</div>
            </div>
            <Form form={form} layout='vertical' className='cm-form'>
                <Form.Item name={"finalLink"} >
                    <TextArea
                        autoSize
                        readOnly
                        ref             =   {inputRef}
                        className       =   "j-copy-buyer-link cm-padding15"
                        style           =   {{
                            height: "auto",
                            resize: "none",
                        }}
                    />
                </Form.Item>
            </Form>
        </div> 
    )
}

export default ResourceCopyLinkForm
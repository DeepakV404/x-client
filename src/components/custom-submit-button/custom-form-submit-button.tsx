import { Button, Form, Space } from 'antd';

import Loading from '../../utils/loading';

const CustomFormSubmitButton = (props: {form: any, submitState: any}) => {

    const { form, submitState } =   props

    return (
        <Form.Item noStyle>
            <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading || submitState.disable}>
                <Space size={10}>
                    <div className="cm-font-size14">{submitState.text}</div>
                    {
                        submitState.loading && <Loading color="#fff"/>
                    }
                </Space>
            </Button>
        </Form.Item>
    )
}

export default CustomFormSubmitButton
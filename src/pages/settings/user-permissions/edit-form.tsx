import { FC } from "react"
import { Button, Col, Form, Input, Row, Space } from "antd";
import { Length_Input } from "../../../constants/module-constants";


interface EditFormProps
{
    isOpen  : boolean;
    onClose :   () => void;
}

const EditForm: FC<EditFormProps> = () => {

    return(
        <>
            <Space direction="vertical" size={5} className="cm-margin-bottom20">
                <div className="cm-font-size16 cm-font-fam500">Edit User</div>
                <div className="j-settings-subtitle-border"></div>
            </Space>
            <Form layout="vertical" className='cm-form'>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item label="First Name" name="firstName" rules= {[{required: true, message: "required", whitespace: true}]}>
                            <Input autoFocus placeholder="First Name" maxLength={Length_Input} size="large"></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Last Name" name="lastName">
                            <Input placeholder="Last Name" maxLength={Length_Input} size="large"></Input>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={"Email"} name="emailId" rules= {[{required: true, message: "Email is required", whitespace: true}]}>
                    <Input placeholder="Email" maxLength={150} size="large" disabled></Input>
                </Form.Item>
        
                <Form.Item>
                    <Button type='primary'>Update User</Button>
                </Form.Item>
                
            </Form>
        </>
    );
}

export default EditForm
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Form, Input, Modal, Select, Space } from 'antd';

import { ALL_USECASE_CATEGORIES } from '../../../templates/api/room-templates-query';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { AccountsAgent } from '../../api/accounts-agent';

import Loading from '../../../../utils/loading';
import { Length_Input } from '../../../../constants/module-constants';

const { useForm }   =   Form;
const { Option }    =   Select;
const { TextArea }  =   Input;

interface UsecaseFormProps
{
    isOpen      :   boolean;
    onClose     :   () => void;
}

const UsecaseForm: FC<UsecaseFormProps> = (props) => {

    const { isOpen, onClose }   =   props;

    const [form]    =   useForm();
    const params    =   useParams();

    const [submitState, setSubmitState] =   useState({
        loading :   false,
        text    :   "Add use case"
    });

    const { data, loading, error }  =   useQuery(ALL_USECASE_CATEGORIES, {
        fetchPolicy: "network-only"
    });

    const onFinish = (values: any) => {

        setSubmitState({
            loading :   true,
            text    :   "Adding usecase..."
        })
    
        AccountsAgent.addUsecase({
            variables: {
                roomUuid    :   params.roomId,
                input           :   {
                    title       :   values.title,
                    groupUuid   :   values.category,
                    description :   values.description,
                }
            },
            onCompletion: () => {
                setSubmitState({
                    loading :   false,
                    text    :   "Add use case"
                })
                form.resetFields()
                onClose()
                CommonUtil.__showSuccess("Use Case added successfully")
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    loading :   false,
                    text    :   "Add use case"
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <Modal 
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
        >
            {
                loading 
                ?
                    <Loading/>
                :
                    error
                    ?
                        <div>Error</div>
                    :
                        <Form className='cm-form' form={form} layout='vertical' onFinish={onFinish}>
                            <Space className="cm-margin-bottom20">
                                <div className="cm-font-size20 cm-font-fam500">Add Use Case</div>
                            </Space>
                            <Form.Item name={"title"} label={<div className="cm-font-fam500 cm-font-size16">Usecase</div>} rules={[{required: true, message: "Enter a usecase"}]}>
                                <Input maxLength={Length_Input} placeholder="eg: Lead to Close" allowClear size='large'/>
                            </Form.Item>
                            <Form.Item name={"description"} label={<div className="cm-font-fam500 cm-font-size16">Description</div>}>
                                <TextArea showCount placeholder="Usecase description" rows={4} allowClear size='large'/>
                            </Form.Item>
                            <Form.Item name={"category"}  label={<div className="cm-font-fam500 cm-font-size16">Category</div>}>
                                <Select className="cm-width100" placeholder="Category" allowClear size='large'>
                                    {
                                        data.allUsecaseCategories.map((_category: any) => (
                                            <Option value={_category.uuid}>{_category.name}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} size="large" htmlType="submit" disabled={submitState.loading}>
                                    <Space size={10}>
                                        <div className="cm-font-size15">{submitState.text}</div>
                                        {
                                            submitState.loading && <Loading color="#fff"/>
                                        }
                                    </Space>
                                </Button>
                            </Form.Item>
                        </Form>
            }
        </Modal>
    )
}

export default UsecaseForm
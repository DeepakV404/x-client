import { useContext } from 'react';
import { Button, Form, Input, Radio, Space } from 'antd';


import { MULTI_CHOICE, MULTI_LINE, SINGLE_CHOICE, SINGLE_LINE } from '../../../pages/settings/config/form-field-config';
import { BuyerDiscoveryContext } from '../../context/buyer-discovery-globals';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { BuyerAgent } from '../../api/buyer-agent';

import DemoUsecaseNotFound from '../../../components/no-result-found';
import DiscoveryCheckbox from './discovery-checkbox';
import TextArea from 'antd/es/input/TextArea';
import Translate from '../../../components/Translate';
import useLocalization from '../../../custom-hooks/use-translation-hook';

const { useForm }   =   Form;

const DiscoverStackedQuestion = (props: {questions : any, onClose: () => void}) => {

    const { showInitalPopup }   =   useContext<any>(BuyerDiscoveryContext);
    const { $sessionId }            =   useContext<any>(BuyerGlobalContext);

    const { questions, onClose }  =   props;

    const { translate } = useLocalization();

    const [form]    =   useForm();

    const _getComponent = (question: any) => {
        switch (question.type) {
            case SINGLE_LINE:
                return (
                    <Input size='large' autoFocus placeholder={translate("discovery-questions.enter-your-answer")} className='j-input-discovery-wrapper'/>
                )
            case MULTI_LINE:
                return(
                    <TextArea  size='large' autoFocus placeholder={translate("discovery-questions.enter-your-answer")} className='j-input-discovery-wrapper'/>
                )
            case MULTI_CHOICE:
                return (
                    <DiscoveryCheckbox question={question}/>
                )
            case SINGLE_CHOICE:
                return (
                    <Radio.Group rootClassName='j-option-wrapper'>
                        {
                            question.options.map((_option: any) => (
                                <Radio value={_option.uuid}>{_option.value}</Radio>
                            ))
                        }
                    </Radio.Group>
                )
        }
    }

    const onFinish = (values: any) => {
        let response: any = [];
        Object.keys(values).map((_value: any) => {
            let resp: any = {
                questionUuid    :   _value,
                response        :   values[_value]
            }
            if(values[_value]){
                if(typeof(values[_value]) === "object" && values[_value].length){
                    resp["type"]    =   "ANSWERED"
                }else if(typeof(values[_value]) === "string"){
                    resp["type"]    =   "ANSWERED"
                }else{
                    resp["type"]    =   "SKIPPED"
                }
            }else{
                resp["type"]    =   "SKIPPED"
            }
            response.push(resp)
        })
        BuyerAgent.updateDiscoveryResponse({
            variables: {
                sessionUuid     :   $sessionId,
                touchPointUuid  :   showInitalPopup.touchpointData.uuid,
                input           :   response
            },
            onCompletion: () => {
                onClose()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const onSkip = () => {
        let values = form.getFieldsValue()
        let response: any = [];
        Object.keys(values).map((_value: any) => {
            let resp: any = {
                questionUuid    :   _value,
                type            :   "SKIPPED",
                response        :   undefined,
            }
            response.push(resp)
        })
        BuyerAgent.updateDiscoveryResponse({
            variables: {
                sessionUuid     :   $sessionId,
                touchPointUuid  :   showInitalPopup.touchpointData.uuid,
                input           :   response
            },
            onCompletion: () => {
                onClose()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        
        <Form form={form} layout='vertical' className='cm-form' onFinish={onFinish}>
            <Space direction='vertical' className='cm-width100 j-discovery-q-wrapper' size={15}>
                {
                    questions && questions.length > 0 ?
                        <>
                            <Space direction='vertical' style={{maxHeight: "calc(100vh - 300px)", overflow: "auto"}} className='cm-width100'>
                                {
                                    questions.map((_question: any) => (
                                        <>
                                            <div className='j-discovery-q-header cm-font-size16 cm-font-fam500'>{_question.question} {_question.isMandatory && <span className='j-mandatory-star'>*</span>}</div>
                                            <div className='j-discovery-form-wrapper'>
                                                <Form.Item
                                                    name            =   {_question.uuid}
                                                    rules           =   {[{required: _question.isMandatory, message: ""}]}
                                                    className       =   'cm-width100'
                                                    valuePropName   =   "value"
                                                >
                                                    {_getComponent(_question)}
                                                </Form.Item>
                                            </div>
                                        </>
                                    ))
                                }
                            </Space>
                            <Space className='cm-flex-justify-end' style={{padding: "0px 15px 15px 0px"}}>
                                <Button type='primary' onClick={onSkip} ghost style={{border:'1px solid rgba(230, 234, 247, 1)', color: 'black'}}>
                                    <Translate i18nKey='common-labels.skip'/>
                                </Button>
                                <Form.Item noStyle>
                                    <Button type='primary' style={{ backgroundColor: 'rgba(22, 26, 48, 1)'}} htmlType='submit'>
                                    <Translate i18nKey='common-labels.submit'/>
                                    </Button>
                                </Form.Item>
                            </Space>
                        </>
                    :
                        <div className='cm-padding20'>
                            <DemoUsecaseNotFound />
                        </div>
                }
            </Space>
        </Form>
    )
}

export default DiscoverStackedQuestion
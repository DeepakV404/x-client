import { useContext } from 'react';
import { Button, Form, Input, Radio, Space } from 'antd';

import { MULTI_CHOICE, MULTI_LINE, SINGLE_CHOICE, SINGLE_LINE } from '../../../pages/settings/config/form-field-config';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { BuyerAgent } from '../../api/buyer-agent';

import DiscoveryCheckbox from './discovery-checkbox';
import TextArea from 'antd/es/input/TextArea';
import Translate from '../../../components/Translate';
import useLocalization from '../../../custom-hooks/use-translation-hook';

const { useForm }   =   Form;

const DiscoverySiderQuestion = (props: {triggeredQuestion: any, onClose: () => void}) => {

    const { triggeredQuestion, onClose }  =   props;

    const { translate } = useLocalization();

    let _question   =   triggeredQuestion.question;

    const { $sessionId }            =   useContext<any>(BuyerGlobalContext);
    
    const [form]    =   useForm();

    const _getComponent = (_question: any) => {
        switch (_question.type) {
            case SINGLE_LINE:
                return (
                    <Input size='large' autoFocus placeholder={translate("discovery-questions.enter-your-answer")} className='j-input-discovery-wrapper'/>
                )
            case MULTI_CHOICE:
                return (
                    <DiscoveryCheckbox question={_question}/>
                )
            case MULTI_LINE:
                return(
                    <TextArea  size='large' autoFocus placeholder={translate("discovery-questions.enter-your-answer")} className='j-input-discovery-wrapper'/>
                )
            case SINGLE_CHOICE:
                return (
                    <Radio.Group rootClassName='j-option-wrapper'>
                        {
                            _question.options.map((_option: any) => (
                                <Radio value={_option.uuid}>{_option.value}</Radio>
                            ))
                        }
                    </Radio.Group>
                )
        }
    }

    const onFinish = (values: any) => {
        BuyerAgent.updateSiderQuestionResponse({
            variables: {
                sessionUuid     :   $sessionId,
                questionUuid    :   _question.uuid,
                response        :   values[_question.uuid]
                
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
        onClose()
    }

    return (
        
        <Form form={form} layout='vertical' className='cm-form' onFinish={onFinish}>
            <Space direction='vertical' className='cm-width100 j-discovery-q-wrapper' size={15}>
                <div className='j-discovery-q-header cm-font-size16 cm-font-fam500'>{_question.question} {_question.isMandatory && <span className='j-mandatory-star'>*</span>}</div>
                <div className='j-discovery-form-wrapper'>
                    <Form.Item
                        name            =   {_question.uuid}
                        rules           =   {[{required: _question.isMandatory, message: ""}]}
                        className       =   'cm-width100'
                        valuePropName   =   "value"
                        initialValue    =   {triggeredQuestion.status === "ANSWERED" ? triggeredQuestion.response : undefined}
                    >
                        {_getComponent(_question)}
                    </Form.Item>
                </div>
                <Space className='cm-flex-justify-end' style={{padding: "0px 15px 15px 0px"}}>
                    {
                        triggeredQuestion.status !== "ANSWERED" ? 
                            <Button type='primary' onClick={onSkip} ghost style={{border:'1px solid rgba(230, 234, 247, 1)', color: 'black'}}>
                                <Translate i18nKey='common-labels.skip'/>
                            </Button>
                        :   
                            null
                    }
                    <Form.Item noStyle>
                        <Button type='primary' style={{ backgroundColor: 'rgba(22, 26, 48, 1)'}} htmlType='submit'>
                            <Translate i18nKey='common-labels.submit'/>
                        </Button>
                    </Form.Item>
                </Space>
            </Space>
        </Form>
    )
}

export default DiscoverySiderQuestion
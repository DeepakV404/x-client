import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Space, Button, Avatar, Collapse, Drawer, Typography, Badge, Form, Input, Radio } from 'antd';

import { MULTI_CHOICE, MULTI_LINE, SINGLE_CHOICE, SINGLE_LINE } from '../../../pages/settings/config/form-field-config';
import { DISCOVERY_ICON } from '../../../constants/module-constants';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { ERROR_CONFIG } from '../../../config/error-config';
import { P_ALL_QUESTIONS } from '../../api/buyers-query';
import { CommonUtil } from '../../../utils/common-util';
import { BuyerAgent } from '../../api/buyer-agent';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import useLocalization from '../../../custom-hooks/use-translation-hook';
import Translate from '../../../components/Translate';
import DiscoveryCheckbox from './discovery-checkbox';
import Loading from '../../../utils/loading';
import TextArea from 'antd/es/input/TextArea';

const { Panel }     =   Collapse;
const { Text }      =   Typography;
const { useForm }   =   Form;

const DiscoveryQuestionDrawer = (props: { isOpen: boolean, onClose: () => void }) => {
    
    const { isOpen, onClose }     =   props;

    const { translate } = useLocalization();

    const { $sessionId }    =   useContext<any>(BuyerGlobalContext);

    const [form]    =   useForm();

    const { data, loading, error }   =   useQuery(P_ALL_QUESTIONS, {
        fetchPolicy: "network-only",
        variables: {
            sessionUuid: $sessionId
        }
    });

    const onFinish = (values: any) => {

        BuyerAgent.updateAllQuestionResponse({
            variables: {
                sessionUuid     :   $sessionId,
                responses       :   values
                
            },
            onCompletion: () => {
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.response-update-message" />);                
                onClose()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    };

    const _getComponent = (question: any) => {
        switch (question.type) {
            case SINGLE_LINE:
                return (
                    <Input size='large' autoFocus placeholder={translate("discovery-questions.enter-your-answer")} name={question.uuid} className='j-input-discovery-wrapper'/>
                );
            case MULTI_CHOICE:
                return (
                    <DiscoveryCheckbox question={question} />
                );
            case MULTI_LINE:
                return(
                    <TextArea  size='large' autoFocus placeholder={translate("discovery-questions.enter-your-answer")} className='j-input-discovery-wrapper'/>
                )
            case SINGLE_CHOICE:
                return (
                    <Radio.Group rootClassName='j-option-wrapper'>
                        {question.options.map((_option: any) => (
                            <Radio value={_option.uuid} key={_option.uuid} name={question.uuid}>
                                {_option.value}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            default:
                return null;
        }
    };

    return (
        <Drawer
            width           =   {500}
            onClose         =   {onClose}
            headerStyle     =   {{ display: 'none' }}
            className       =   "j-discovery-q-drawer"
            open            =   {isOpen}
            getContainer    =   {false}
            closable        =   {false}
            footer          =   {
                <Space className="j-discovery-drawer-footer">
                    <Button onClick={onClose}><Translate i18nKey='common-labels.close'/></Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        <Translate i18nKey='common-labels.submit'/>
                    </Button>
                </Space>
            }
        >
            {
                loading ? 
                    <Loading/> 
                    : 
                    (
                        error ? <SomethingWentWrong/> 
                        :
                            (
                                <>
                                    <Space className="j-drawer-header">
                                        <Avatar
                                            size    =   {50}
                                            shape   =   "square"
                                            style   =   {{
                                                backgroundColor: '#ededed',
                                                color: '#000',
                                                fontSize: '15px',
                                                display: 'flex',
                                                borderRadius: '12px',
                                            }}
                                            src     =   {DISCOVERY_ICON}
                                        ></Avatar>
                                        <Space direction="vertical" size={0}>
                                            <Text><Translate i18nKey='discovery-questions.title'/> ({data._pAllQuestions.filter((_question: any) => _question.status === "ANSWERED").length}/{data._pAllQuestions.length})</Text>
                                            <Text type="secondary" className='cm-font-size12'><Translate i18nKey='discovery-questions.answer-all-questions'/></Text>
                                        </Space>
                                    </Space>

                                    <Form form={form} layout='vertical' className='cm-form cm-padding10' onFinish={onFinish}>
                                        <Collapse
                                            rootClassName       =   'j-question-collapse'
                                            expandIconPosition  =   'end'
                                            bordered            =   {false}
                                            expandIcon          =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="expand_more" size='22' /> : <MaterialSymbolsRounded font="expand_less" size='22' />}
                                        >
                                            {
                                                data._pAllQuestions.map((triggeredTouchpoint: any) => (
                                                    <Panel
                                                        header={
                                                            <Space>
                                                                <Badge
                                                                    dot     =   {triggeredTouchpoint.question.isMandatory}
                                                                    status  =   "error"
                                                                    offset  =   {[-30, 2]}
                                                                >
                                                                    <div className={`j-discovery-q-trigger ${triggeredTouchpoint.status.toLowerCase()} cm-cursor-pointer`}>
                                                                        <MaterialSymbolsRounded font='help' size='22' filled />
                                                                    </div>
                                                                </Badge>
                                                                <div>{triggeredTouchpoint.question.question}</div>
                                                            </Space>
                                                        }
                                                        key={triggeredTouchpoint.question.uuid}
                                                    >
                                                        <div className='j-discovery-form-wrapper'>
                                                            <Form.Item name={triggeredTouchpoint.question.uuid} initialValue={triggeredTouchpoint.response} rules={[{required: triggeredTouchpoint.question.isMandatory, message: translate("common-placeholder-required-message.disovery-required")}]}>
                                                                {
                                                                    _getComponent(triggeredTouchpoint.question)
                                                                }
                                                            </Form.Item>
                                                        </div>
                                                    </Panel>
                                                ))
                                            }
                                        </Collapse>
                                    </Form>
                                </>
                            ) 
                    )
            }
        </Drawer>
    );
};

export default DiscoveryQuestionDrawer;

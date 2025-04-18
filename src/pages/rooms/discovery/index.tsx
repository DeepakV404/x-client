import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Badge, Card, Collapse, Form, Input, Radio, Space } from 'antd';

import { MULTI_CHOICE, MULTI_LINE, SINGLE_CHOICE, SINGLE_LINE } from '../../settings/config/form-field-config';
import { R_DISCOVERY_QUESTIONS } from '../api/rooms-query';

import DiscoveryCheckbox from '../../../buyer-view/layout/buyer-discovery/discovery-checkbox';
import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import NoResultFound from '../../../components/no-result-found';
import Loading from '../../../utils/loading';

const { Panel }     =   Collapse;
const { TextArea }  =   Input;

const DiscoveryResponse = () => {

    const { roomId }    =   useParams()

    const { data, loading, error }  =   useQuery(R_DISCOVERY_QUESTIONS, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid:   roomId
        }
    });

    const _getComponent = (question: any) => {
        switch (question.type) {
            case SINGLE_LINE:
                return (
                    <Input disabled size='large' autoFocus placeholder='Enter your answer' name={question.uuid} className='j-input-discovery-wrapper'/>
                );
            case MULTI_CHOICE:
                return (
                    <DiscoveryCheckbox question={question} disabled={true}/>
                );
            case MULTI_LINE:
                return(
                    <TextArea  size='large' autoFocus placeholder='Enter your answer' className='j-input-discovery-wrapper'/>
                )
            case SINGLE_CHOICE:
                return (
                    <Radio.Group disabled rootClassName='j-option-wrapper'>
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

    if (loading) return <Card bordered={false} className="j-room-activity-card cm-width100 cm-flex-center"><Loading /></Card>
    if (error) return <SomethingWentWrong/>

    return (
        <Card bordered={false} className="j-room-activity-card cm-width100 cm-flex-center cm-overflow-auto">
            <Form layout='vertical' className='cm-form cm-padding10 cm-height100' >
                {
                    data._rDiscoveryResponses.length > 0 ?
                        <>
                            <div className='cm-font-fam500 cm-font-size16 cm-margin-bottom10'>Response</div>
                            <Collapse
                                expandIconPosition  =   'end'
                                bordered            =   {false}
                                expandIcon          =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="expand_more" size='22' /> : <MaterialSymbolsRounded font="expand_less" size='22' />}
                            >
                                {
                                    data._rDiscoveryResponses.map((triggeredTouchpoint: any) => (
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
                                                <Form.Item name={triggeredTouchpoint.question.uuid} initialValue={triggeredTouchpoint.response} rules={[{required: triggeredTouchpoint.question.isMandatory, message: "This is a mandatory question"}]}>
                                                    {
                                                        _getComponent(triggeredTouchpoint.question)
                                                    }
                                                </Form.Item>
                                            </div>
                                        </Panel>
                                    ))
                                }
                            </Collapse>
                        </>
                    :
                        <div className='cm-height100 cm-flex-center'>
                            <NoResultFound message={"No responses yet!"} description={"Configure discovery questions and wait for your buyer's response."}/>
                        </div>
                }
            </Form>
        </Card>
    )
}

export default DiscoveryResponse
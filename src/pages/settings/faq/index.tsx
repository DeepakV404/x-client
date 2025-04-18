import { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Collapse, Form, Input, Space } from 'antd';

import { SETTINGS_FAQ } from '../../../config/role-permission-config';
import { PermissionCheckers } from '../../../config/role-permission';
import { Length_Input } from '../../../constants/module-constants';
import { GlobalContext } from '../../../globals';
import { FAQS } from '../api/settings-query';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import DemoUsecaseNotFound from '../../../components/no-result-found';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import Loading from '../../../utils/loading';
import FaqUpdate from './faq-update';
import FaqModal from './faq-modal';

const { useForm }   =   Form;
const { TextArea }  =   Input;

const Faq = () => {

    const [form]    =   useForm();

    const { $user } =   useContext(GlobalContext);

    const showFooter                =   PermissionCheckers.__checkPermission($user.role, SETTINGS_FAQ, 'create');

    const [showFaqModal, setShowFaqModal]  = useState(false);

    const { data, loading, error }  =   useQuery(FAQS, {
        fetchPolicy: "network-only"
    });
    

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return (
        <>
            <div className="cm-height100 cm-overflow-auto">
                <div className='cm-width100 j-setting-header'>
                    <Space>
                        <MaterialSymbolsRounded font='quiz' size='22' color="#0065E5"/>
                        <div className="cm-font-size16 cm-font-fam500">FAQ</div>
                    </Space>
                </div>        
                <div className='cm-padding20 j-setting-body' style={showFooter ? {} : {height: "calc(100% - 43px)"}}>
                    {
                        data.faqs && data.faqs.length > 0
                        ?
                            <Collapse 
                                className           =   'j-faq-collapse'
                                bordered            =   {false} 
                                expandIconPosition  =   {'end'} 
                                expandIcon          =   {(state) => <MaterialSymbolsRounded font={state.isActive ? 'expand_less': "expand_more"} size="20"/>}
                            >
                                {
                                    data.faqs.map((item: { question: string; uuid: string; answer: string }) => (
                                        <CollapsePanel 
                                            key       =  {item.uuid}
                                            header    =  {
                                                <Form form={form} key={item.uuid} className='cm-form'>
                                                    <Form.Item name={[item.uuid, "question"]} initialValue={item.question} rules = {[{required: true, message: 'Question cannot be empty'}]}>
                                                        <TextArea  rows={1} placeholder='Question' maxLength={Length_Input} bordered={false} className='cm-font-fam500 cm-font-size16' style={{paddingLeft: "0px"}}/>
                                                    </Form.Item>
                                                </Form>
                                            }
                                        >
                                            <FaqUpdate faq={item} formRef={form}/>
                                        </CollapsePanel>
                                    ))
                                }
                            </Collapse>
                        :
                            <div className="cm-light-text cm-flex-center cm-height100"><DemoUsecaseNotFound  message={"No FAQ's Found"} /></div>
                    }
                </div>
            </div>
            {
                showFooter &&
                    <div className='j-setting-footer cm-width100'>
                        <Button type='primary' onClick={() => setShowFaqModal(true)} className="cm-flex-center">
                            Add
                        </Button>
                    </div>
            }
            <FaqModal
                isOpen   =  {showFaqModal}
                onClose  =  {() => setShowFaqModal(false)}
            />
        </>
    )
}

export default Faq
import { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Card, Collapse, Space,  } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { TOUCH_POINT_TYPE_FAQ, TOUCH_POINT_TYPE_GENERAL, WHEN_ON_VISIT_FAQ, WHEN_ON_VISIT_FAQ_SECTION } from '../../config/buyer-discovery-config';
import { BuyerDiscoveryContext } from '../../context/buyer-discovery-globals';
import { TEMPLATE_PREVIEW } from '../../config/buyer-constants';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { BUYER_FAQS } from '../../api/buyers-query';
import { BuyerAgent } from '../../api/buyer-agent';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import LocalCache from '../../../config/local-storage';
import Translate from '../../../components/Translate';
import Loading from '../../../utils/loading';

const BuyerFaq = (props: {setShowPreviewForm: any}) => {

    const { setShowPreviewForm }    =   props;

    const params    =   useParams()

    const { $orgProperties, $buyerData }        =   useContext(BuyerGlobalContext);
    const { $customSections }                   =   useContext<any>(BuyerGlobalContext);
    

    const { touchPoints, setShowInitialPopup }  =   useContext<any>(BuyerDiscoveryContext);
    
    const $TalkToUs                             =   $customSections?.filter((item: any) => item.type === "TALK_TO_US" && item.isEnabled === true)[0];
    const $isTemplatePreview                    =   $buyerData?.portalType === TEMPLATE_PREVIEW;

    const { data, loading, error }          =   useQuery(BUYER_FAQS, {
        fetchPolicy: 'network-only'
    });

    let discoveryQuestionsTimeoutId: any

    let pageVisitTime = 0;

    useEffect(() => {

        let pageInterval = setInterval(() => {
            pageVisitTime += 1
        }, 1000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                BuyerAgent.trackSectionEvent({
                    variables: {
                        input: {
                            sectionUuid         :   params.sectionId,
                            durationSpentInSecs :   pageVisitTime
                        }
                    },
                    onCompletion: () => {
                        pageVisitTime = 0;
                        clearInterval(pageInterval);
                    },
                    errorCallBack: () => {}
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            if (pageVisitTime > 0) {
                BuyerAgent.trackSectionEvent({
                    variables: {
                        input: {
                            sectionUuid         :   params.sectionId,
                            durationSpentInSecs :   pageVisitTime
                        }
                    },
                    onCompletion: () => {
                        pageVisitTime = 0;
                        clearInterval(pageInterval);
                    },
                    errorCallBack: () => {}
                });
            }

            clearInterval(pageInterval);
        };
    }, []);

    const navigate  =   useNavigate();

    const handleClick = () => {
        if($isTemplatePreview && (!LocalCache.getData("isPreviewFormClosed"))){
            setShowPreviewForm(true)
        }else if($TalkToUs?.isEnabled){
            navigate(`/${$TalkToUs?.uuid}`);
        }else{
            window.open(`mailto:${$orgProperties.supportEmail}`, "_blank")
        }
    };
    
    let $faqTouchPoints     = touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_FAQ);

    const handleOnChange = (openedFaqs: any) => {
        
        let currentOpenedFaq    =   openedFaqs.at(-1);

        const faqToBeTriggered = $faqTouchPoints.filter(
            (_faqTouchPoint: any) =>
                _faqTouchPoint.target.when === WHEN_ON_VISIT_FAQ &&
                _faqTouchPoint.target.entityUuid === currentOpenedFaq
        );        

        if(faqToBeTriggered.length){
            if(faqToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   faqToBeTriggered[0]
                    })
                }, (faqToBeTriggered[0].target.durationInSecs ?? 0 ) * 1000)
            }
        }
    }

    let $faqSectionTouchPoints     =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);

    useEffect(() => {

        const faqSectionOnLoadToBeTriggered = $faqSectionTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_VISIT_FAQ_SECTION
        );

        if(faqSectionOnLoadToBeTriggered.length){
            if(faqSectionOnLoadToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   faqSectionOnLoadToBeTriggered[0]
                    })
                }, (faqSectionOnLoadToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }

    }, [touchPoints])

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return( 

        <div className='j-buyer-cm-padding cm-width100'>
            <div className='j-buyer-cm-card'>
                <Space direction='vertical' align='center' className='cm-width100'>
                    <div className='j-faq-title cm-font-size24 cm-font-fam500'><Translate i18nKey={"faq.faq"}/> (<Translate i18nKey={"faq.frequently-asked-questions"}/>)</div>
                    <div className='j-faq-subtitle cm-font-fam400'>
                        <Translate i18nKey='faq.subtitle'/>
                    </div>
                </Space>
                <Collapse 
                    className           =   'j-faq-collapse'
                    expandIcon          =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="expand_less" size='22'/> : <MaterialSymbolsRounded font="expand_more" size='22'/>}                    
                    bordered            =   {false}
                    expandIconPosition  =   {'end'}
                    onChange            =   {(openedFaqs: any) => handleOnChange(openedFaqs)}
                    destroyInactivePanel=   {true}
                >
                    {
                        data.faqs.map((_faq: { question: string; uuid: string; answer: string }) => (
                            <CollapsePanel 
                                header    =  {<div style={{wordBreak: "break-word"}}>{_faq.question}</div>}
                                key       =  {_faq.uuid}
                            >
                                <p className='cm-font-fam400 cm-overflow-wrap-break-word'>{_faq.answer}</p>
                            </CollapsePanel>
                        ))
                    }
                </Collapse>
                {
                    ($buyerData?.sellerAccount.calendarUrl && $TalkToUs?.isEnabled) || $orgProperties.supportEmail &&
                        <Card className='j-faq-card'>
                            <span className='cm-font-size16 cm-font-fam600'>
                                <Translate i18nKey={"faq.still-have-questions"}/>
                            </span>
                            {$orgProperties.supportEmail && (<p className='cm-font-fam500 cm-text-align-center'><Translate i18nKey={"faq.write-down-to"}/> <a href={`mailto:${$orgProperties.supportEmail}`}>{$orgProperties.supportEmail}</a></p>)}
                            {
                                $buyerData?.sellerAccount.calendarUrl && $TalkToUs?.isEnabled &&
                                    <Button onClick={handleClick} type="primary" className='j-faq-btn'>
                                        <Translate i18nKey={"common-labels.get-in-touch"}/>
                                    </Button>
                            }
                        </Card>
                }
            </div>
        </div>
    );
}

export default BuyerFaq;
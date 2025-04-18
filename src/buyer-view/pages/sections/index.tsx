import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import {
    WIDGET_BUTTON,
    WIDGET_CAROUSEL,
    WIDGET_CONTACT_CARD,
    WIDGET_EMBEDDED,
    WIDGET_FEATURE,
    WIDGET_FILE_UPLOAD,
    WIDGET_RESOURCE,
    WIDGET_TEAMS_CARD,
    WIDGET_TEXT,
    WIDGET_HEADER
} from '../../../pages/rooms/config/widget-config';

import { P_SECTION } from '../../api/buyers-query';
import { BuyerAgent } from '../../api/buyer-agent';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import useLocalization from '../../../custom-hooks/use-translation-hook';
import EmptyText from '../../../components/not-found/empty-text';
import BuyerSectionResource from './widget-resource';
import BuyerContactCardWidget from './widget-contact-card';
import BuyerTeamCardsWidget from './widget-team-cards';
import BuyerSectionText from './widget-text';
import BuyerCarouselWidget from './widget-carousel';
import SectionProtected from './section-protected';
import BuyerButtonWidget from './widget-button';
import BuyerEmbedWidget from './widget-embed';
import Loading from '../../../utils/loading';
import BuyerFeatureWidget from './widget-feature';
import BuyerFileUploadWidget from './widget-file-upload';
import BuyerHeaderWidget from './widget-header';

const BuyerSection = () => {
    
    const navigate              =   useNavigate();
    const params: any           =   useParams();
    const buyerPortalId: any    =   window.location.pathname.split("/")[2];
    const errorCodes: number[]  =   [8039, 8040, 8042, 8043];

    const { translate }         =   useLocalization();

    let pageVisitTime           =   0;

    const [isProtectedNotVerified, setIsProtectedNotVerified]   =   useState(false);

    const { data, loading, error } = useQuery(P_SECTION, {
        variables: {
            sectionUuid: params.sectionId,
        },
        fetchPolicy: 'network-only',

        onError(error: any) {
            if(errorCodes.includes(error.graphQLErrors[0].code)) navigate("/")
        },
    });

    const checkSessionExpired = (sessionCreatedOn: any) => {
        var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
        return (sessionCreatedOn - new Date().valueOf()) >= OneDay
    }

    useEffect(() => {
        let unparsedPortalData: any =   localStorage.getItem(buyerPortalId);
        let portalData              =   unparsedPortalData ? JSON.parse(unparsedPortalData) : null;
        if(data){
            if(data._pSection.isProtected){
                if(!portalData || !portalData.sessionCreatedOn || checkSessionExpired(portalData.sessionCreatedOn)){
                    setIsProtectedNotVerified(true)
                }else{
                    setIsProtectedNotVerified(false)
                }
            }else{
                setIsProtectedNotVerified(false)
            }
        }
    }, [data])

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
    }, [params.sectionId]);

    const onVerify = () => {
        setIsProtectedNotVerified(false)
    }

    if (loading) return <Loading />
    if (error) return <SomethingWentWrong/>


    const getSectionComponent = (widget: any) => {
        switch (widget.type) {
            case WIDGET_TEXT:
                return <BuyerSectionText widget={widget} key={widget.uuid} />

            case WIDGET_BUTTON:
                return <BuyerButtonWidget widget={widget} key={widget.uuid}/>

            case WIDGET_RESOURCE:
                return <BuyerSectionResource widget={widget} key={widget.uuid} widgets={data._pSection.widgets}/>

            case WIDGET_CAROUSEL:
                return <BuyerCarouselWidget widget={widget} key={widget.uuid}/>

            case WIDGET_EMBEDDED:
                return <BuyerEmbedWidget widget={widget} key={widget.uuid}/>

            case WIDGET_CONTACT_CARD:
                return <BuyerContactCardWidget widget={widget} key={widget.uuid}/>

            case WIDGET_TEAMS_CARD:
                return <BuyerTeamCardsWidget widget={widget} key={widget.uuid}/>

            case WIDGET_FEATURE:
                return <BuyerFeatureWidget widget={widget} key={widget.uuid}/>

            case WIDGET_FILE_UPLOAD: 
                return <BuyerFileUploadWidget widget={widget} />

            case WIDGET_HEADER:
                return <BuyerHeaderWidget widget={widget} key={widget.uuid}/>
        }
    }

    if(data && data._pSection){
        if(isProtectedNotVerified){
            return <div className='cm-height100 cm-width100' style={{ padding: "75px" }}><SectionProtected onVerify={onVerify} type='section-level'/></div>
        }else{
            if(params && params.sectionId) {
                return (
                    <div className={`j-buyer-section-content ${(data?._pSection?.widgets.length === 1 && data?._pSection?.widgets[0].type === WIDGET_RESOURCE) ? "" : "j-buyer-cm-padding"}`} style={{padding: (data?._pSection?.widgets.length === 1 && data?._pSection?.widgets[0].type === WIDGET_RESOURCE) ? "4%" : ""}}>
                        {
                            data._pSection.widgets.length > 0 
                            ?
                                data._pSection.widgets.map((_widget: any) => (
                                    getSectionComponent(_widget)
                                ))
                            :
                                <div style={{height: "calc(100vh - 165px)"}}>
                                    <EmptyText text ={translate("common-empty.no-widgets-found")}/>
                                </div>
                        }
                    </div>
                )
            }
        }
    }

};

export default BuyerSection;

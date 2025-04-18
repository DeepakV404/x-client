import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import SomethingWentWrong from '../../../../../components/error-pages/something-went-wrong';
import useLocalization from '../../../../../custom-hooks/use-translation-hook';
import { WIDGET_TEXT, WIDGET_BUTTON, WIDGET_RESOURCE, WIDGET_CAROUSEL, WIDGET_EMBEDDED, WIDGET_CONTACT_CARD, WIDGET_TEAMS_CARD, WIDGET_FEATURE, WIDGET_FILE_UPLOAD, WIDGET_HEADER } from '../../../../../pages/rooms/config/widget-config';
import Loading from '../../../../../utils/loading';
import { BuyerAgent } from '../../../../api/buyer-agent';
import { P_SECTION } from '../../../../api/buyers-query';
import SectionProtected from '../../../../pages/sections/section-protected';
import BuyerButtonWidget from '../../../../pages/sections/widget-button';
import BuyerCarouselWidget from '../../../../pages/sections/widget-carousel';
import BuyerContactCardWidget from '../../../../pages/sections/widget-contact-card';
import BuyerEmbedWidget from '../../../../pages/sections/widget-embed';
import BuyerFeatureWidget from '../../../../pages/sections/widget-feature';
import BuyerFileUploadWidget from '../../../../pages/sections/widget-file-upload';
import BuyerHeaderWidget from '../../../../pages/sections/widget-header';
import BuyerSectionResource from '../../../../pages/sections/widget-resource';
import BuyerTeamCardsWidget from '../../../../pages/sections/widget-team-cards';
import BuyerSectionText from '../../../../pages/sections/widget-text';
import { Anchor, message, Space, Typography } from 'antd';
import WidgetComments from '../../../components/widget-comments';
import MaterialSymbolsRounded from '../../../../../components/MaterialSymbolsRounded';
import { CommonUtil } from '../../../../../utils/common-util';
import { BuyerGlobalContext } from '../../../../../buyer-globals';
import { TEMPLATE_PREVIEW } from '../../../../config/buyer-constants';

const { Text }  =   Typography;

const BuyerSectionV2 = () => {
    
    const navigate              =   useNavigate();
    const location              =   useLocation();
    const params: any           =   useParams();
    const buyerPortalId: any    =   window.location.pathname.split("/")[2];
    const errorCodes: number[]  =   [8039, 8040, 8042, 8043];
    const { $buyerData }        =   useContext(BuyerGlobalContext);

    const $isTemplatePreview    =   $buyerData?.portalType === TEMPLATE_PREVIEW;

    const { translate }         =   useLocalization();

    let pageVisitTime           =   0;
    
    const [activeSection, setActiveSection]         =   useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        const widgetIfFromSearch    = url.searchParams.get("widgetid");
        const sectionIfFromSearch   = url.searchParams.get("sectionid");

        if (widgetIfFromSearch && sectionIfFromSearch) {
            let attempts = 0;
            const maxAttempts = 10;

            const findElement = () => {
                const targetElement = document.getElementById(widgetIfFromSearch);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

                    url.searchParams.delete("widgetid");
                    url.searchParams.delete("sectionid");

                    window.history.replaceState({}, "", url.pathname + url.search + window.location.hash);
                    
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(findElement, 300);
                }
            };

            findElement();

        }
    }, [location.search]);

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

    useEffect(() => {
        const url = new URL(window.location.href);
        const widgetIfFromSearch = url.searchParams.get("widgetid");
        if(data && !widgetIfFromSearch){
            setActiveSection(data?._pSection?.widgets[0]? data?._pSection?.widgets[0].uuid : "")
        }
    }, [data])

    useEffect(() => {
        data?._pSection?.widgets?.length ? data?._pSection?.widgets[0].uuid : "";
    }, [data])

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

    useEffect(() => {
        const widgets = data?._pSection?.widgets.map((_widget: any) => _widget.uuid);
        const observerOptions = { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 };

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                    break;
                }
            }
        }, observerOptions);

        widgets?.forEach((id: string) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [data]);

    if (loading) return <div style={{minHeight: "calc(100vh - 410px)"}} className='cm-flex-center'><Loading /></div>
    if (error) return <div style={{minHeight: "calc(100vh - 410px)"}} className='cm-flex-center'><SomethingWentWrong/></div>


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

    const handleCopyWidgetLink = (widget: any) => {
        if($isTemplatePreview || CommonUtil.__getQueryParams(window.location.search).preview === "true"){
            message.warning({
                className: "",
                content :   "This preview is just for viewing"
            })
            return
        }
        window.navigator.clipboard.writeText($buyerData?.properties.roomLink + "&sectionid=" + (params.sectionId) + "&widgetid=" + (widget.uuid))
        CommonUtil.__showSuccess("Link copied successfully")
    }

    const handleAnchorClick = (
        e: React.MouseEvent<HTMLElement>,
        link: { title: React.ReactNode; href: string }
    ) => {
        e.preventDefault();
      
        setActiveSection(link.href)
        const targetElement = document.getElementById(link.href);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const items: any = [];

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent?.trim();
    }

    data?._pSection?.widgets.map((_widget: any) => {
        getParsedString(_widget.title.value) ?
            items.push( {
                key: _widget.uuid,
                href: _widget.uuid,
                title: <Text className="bn-anchor-text cm-font-size13" ellipsis={{tooltip: getParsedString(_widget.title.value)}}>{getParsedString(_widget.title.value)}</Text>,
                target: _widget.uuid
            })
        :
            null
    })
      


    if(data && data._pSection){
        if(isProtectedNotVerified){
            return <div className='cm-height100 cm-width100' style={{ padding: "75px" }}><SectionProtected onVerify={onVerify} type='section-level'/></div>
        }else{
            if(params && params.sectionId) {
                return (
                    // <div className={`j-buyer-section-content ${(data?._pSection?.widgets.length === 1 && data?._pSection?.widgets[0].type === WIDGET_RESOURCE) ? "" : "j-buyer-cm-padding"}`} style={{padding: (data?._pSection?.widgets.length === 1 && data?._pSection?.widgets[0].type === WIDGET_RESOURCE) ? "4%" : ""}}>
                    <div className="bn-section-body-wrapper" style={{minHeight: "calc(100vh - 410px)"}}>
                        <Anchor
                            affix={true}
                            rootClassName="bn-stickey-anchor-wrapper"
                            className="bn-stickey-anchor-wrapper"
                            onClick={handleAnchorClick}
                            getCurrentAnchor={() => `${activeSection}`}
                            style={{
                                fontSize: "16px"
                            }}
                            items={items}
                        />
                        <div className="bn-section-container cm-width100 cm-flex cm-flex-direction-column cm-flex-align-center" style={{rowGap: "25px"}}>
                            {
                                data._pSection.widgets.length > 0 
                                ?
                                    data._pSection.widgets.map((_widget: any) => (
                                        <div className='cm-width100 bn-item cm-position-relative'>
                                            <Space className="bn-widget-link-comments cm-cursor-pointer cm-float-right show-on-hover-icon" size={0} style={{right: "-36px"}}>
                                                <div className="bn-widget-copy-link cm-flex-center">
                                                    <MaterialSymbolsRounded color='#1F1F1F' font="link" size="20" onClick={() => handleCopyWidgetLink(_widget)}/>
                                                </div>
                                                <div className='bn-widget-comments'>
                                                    <WidgetComments widget={_widget}/>
                                                </div>
                                            </Space>
                                            {getSectionComponent(_widget)}
                                        </div>
                                    ))
                                :
                                    <div style={{height: "calc(100vh - 650px)"}} className='cm-flex-center cm-font-opacity-black-65'>
                                        {translate("common-empty.no-widgets-found")}
                                    </div>
                            }
                        </div>
                    </div>
                )
            }
        }
    }

};

export default BuyerSectionV2;

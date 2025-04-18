import { useState } from 'react';
import { Button, Carousel, Space } from 'antd';

import { LINK, VIDEO } from '../../../../pages/library/config/resource-type-config';
import { CAROUSEL_FALLBACK_IMAGE1, CAROUSEL_FALLBACK_IMAGE2 } from '../../../../constants/module-constants';
import { CommonUtil } from '../../../../utils/common-util';

import BuyerResourceViewerModal from '../../resource-viewer/buyer-resource-viewer-modal';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import BuyerWidgetTitle from '../buyer-widget-title';

const BuyerCarouselWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    const [viewFile, setViewFile]    =   useState<any>({
        isOpen      :   false,
        onClose     :   () => {},
        resourceInfo:   ""
    });

    const handleResourceClick = (fileInfo: any) => {
        setViewFile({
            isOpen          :   true,
            onClose         :   () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}),
            resourceInfo    :   fileInfo
        })
    }

    const getButton = (resource: any) => {
        if(resource.type === VIDEO || resource.type === LINK && CommonUtil.__checkVideoDomain(resource.content.url)){
            return (
                <div className="j-video-play-icon">
                    <MaterialSymbolsRounded font="play_circle" size="110"/>
                </div>
            )
        }else{
            return (
                <Button className="cm-flex-center" size="large" style={{background: "#161a30", color: "#fff", border: "none", borderRadius: "6px"}}>
                    <Space>
                        <MaterialSymbolsRounded font="visibility" size="22"/>
                        <div className="cm-font-fam400">View Document</div>
                    </Space>
                </Button>
            )
        }
    }

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    return (
        <>
            <div className='j-buyer-section-card' style={{paddingInline: "60px"}} id={widget.uuid}>
                <Space direction="vertical" className="cm-width100 cm-margin-bottom20 cm-margin-top10" size={15}>
                    {
                       widget.title.enabled && getParsedString(widget.title.value) ? <BuyerWidgetTitle widget={widget}/> : null
                    }
                    <Carousel arrows className="j-buyer-section-carousel-root" waitForAnimate infinite={false}>
                        {
                            widget.components.filter((item: any) => item.content.resource).map((_component: any, index: number) => {
                                const FALLBACK_IMAGE = (index === 0) ? CAROUSEL_FALLBACK_IMAGE1 : CAROUSEL_FALLBACK_IMAGE2 ;
                                return (
                                    <div className="cm-cursor-pointer cm-height100 cm-width100 cm-flex-center cm-padding1 j-buyer-resource-record-wrapper">
                                        {
                                            _component?.content?.resource?.value 
                                            ?
                                                <>
                                                    <div className="j-buyer-resource-record-mask" onClick={() => handleResourceClick(_component.content?.resource?.value)} >
                                                        {getButton(_component?.content?.resource?.value)}
                                                    </div>
                                                    {
                                                        _component?.content?.resource?.value?.content?.thumbnailUrl
                                                        ? 
                                                            <img className="cm-width100 cm-height100 cm-object-fit-scale-down" style={{borderRadius: "inherit"}} src={_component?.content?.resource?.value?.content?.thumbnailUrl}/> 
                                                        : 
                                                            <img style={{borderRadius: "inherit"}} className="cm-width100" src={CommonUtil.__getResourceFallbackImage(widget?.components[index]?.content?.resource?.value?.content?.type)}/>
                                                    }
                                                </>
                                            :
                                                <div>
                                                    <img src={FALLBACK_IMAGE} style={{borderRadius: "12px", width: "100%"}}/>
                                                </div>
                                        }
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                </Space>
            </div>
            <BuyerResourceViewerModal
                isOpen          =   {viewFile.isOpen}
                onClose         =   {viewFile.onClose}
                fileInfo        =   {viewFile.resourceInfo}
            /> 
        </>
    )
}

export default BuyerCarouselWidget
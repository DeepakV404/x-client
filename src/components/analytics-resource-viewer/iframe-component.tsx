import { Space } from 'antd';

import { CommonUtil } from '../../utils/common-util';

import MaterialSymbolsRounded from '../MaterialSymbolsRounded';

const IframeComponent = (props: {resource: any}) => {

    const { resource }  =   props;

    const checkDocsUrl: any = (link: string) => {
 
        const urlMatch = link.match(/https?:\/\/[^\s"<>]+/);
    
        if (!urlMatch) return false;

        let contentUrl = urlMatch[0];
 
        if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
            contentUrl = 'https://' + contentUrl;
        }

        try {
            const urlObj = new URL(contentUrl);
    
            if (urlObj.origin === "https://docs.google.com") {
                urlObj.pathname = urlObj.pathname.replace(/\/edit$/, "/embed");
                return urlObj.toString();
            }
        } catch (e) {
            return false;
        }

        return false
 
    };

    const parseUrl = (link: string) => {
        let contentUrl = link;
 
        if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
            contentUrl = 'https://' + contentUrl;
        }

        return contentUrl

    }
    

    if(checkDocsUrl(resource.content.url)) {
        return <iframe width="100%" height="100%" src={checkDocsUrl(resource.content.url)} frameBorder={0}></iframe>
    }else{
        return (
            <div className='cm-height100 cm-width100'>
                <div style={{height: "50px"}}>
                    <a href={parseUrl(resource.content.url)} target='_blank' >
                        <Space style={{height: "40px"}} className='cm-float-right'>
                            <MaterialSymbolsRounded font='open_in_new' size='20'/>
                            Open link
                        </Space>
                    </a>
                </div>
                <div style={{height: "calc(100% - 50px)"}} className='cm-flex-center'>
                    <a href={parseUrl(resource.content.url)} target='_blank' style={{height: "calc(100% - 50px)", width: "calc(100% - 50px)"}}>
                        <img 
                            width       =   {"100%"}
                            height      =   {"100%"}
                            className   =   "j-anim-img-zoomable" 
                            alt         =   {resource.title} 
                            src         =   {resource.content.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{objectFit :"scale-down"}}
                        />
                    </a>
                </div>
            </div>
        )
    }
}

export default IframeComponent
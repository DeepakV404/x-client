import { VALID_APP_SUB_DOMAINS } from './constants/module-constants';
import { CommonUtil } from './utils/common-util';
import BuyerRouter from './buyer-view/buyer-router';

import HubspotThemeConfig from './theme-configs/hubspot-theme-config';
import CommonLinkLanding from './components/common-link-landing';
import SFDCThemeConfig from './theme-configs/sfdc-theme-config';
import HubspotGlobals from './hubspot-app/hubspot-globals';
import SellerMiddleware from './seller-middleware';
import SFDCGlobals from './sfdc-app/sfdc-globals';
import ApiContext from './api-context';
import HubspotApp from './hubspot-app';
import SFDCApp from './sfdc-app';
import CreateBSOrg from './create-bs-org';

function App() {

    if(VALID_APP_SUB_DOMAINS.includes(CommonUtil.__getSubdomain(window.location.origin)) || !CommonUtil.__getSubdomain(window.location.origin)){
        return (
            <CreateBSOrg> 
                <ApiContext>
                    <SellerMiddleware/>
                </ApiContext>
            </CreateBSOrg>
        )
    }else if(CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
        return (
            <ApiContext>
                <SFDCGlobals>
                    <SFDCThemeConfig>
                        <SFDCApp/>
                    </SFDCThemeConfig>
                </SFDCGlobals>
            </ApiContext>
        )
    }else if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app"){
        return (
            <ApiContext>
                <HubspotGlobals>
                    <HubspotThemeConfig>
                        <HubspotApp />
                    </HubspotThemeConfig>
                </HubspotGlobals>
            </ApiContext>
        )
    }else if(CommonUtil.__getQueryParams(window.location.search).isBuyerPortal){
    return (
            <ApiContext>
                <CommonLinkLanding/>
            </ApiContext>
        )
    }else{
        return (
            <ApiContext>
                <BuyerRouter/>
            </ApiContext>
        )
    }
}

export default App

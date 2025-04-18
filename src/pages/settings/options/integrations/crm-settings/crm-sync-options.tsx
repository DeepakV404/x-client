import { Space } from "antd";

import { BUYERSTAGE_PRODUCT_LOGO, HUBSPOT_LOGO_NEW, SALESFORCE_LOGO } from "../../../../../constants/module-constants";
import { SALESFORCE } from "../../../config/integration-type-config";

import SfdcSyncOptions from "./sfdc-options";

const CRMSyncOptions = (props: {crmType: string, onClose: () => void, settings: any}) => {

    const { crmType, settings, onClose }  =   props;

    return(
        <>
            <Space className='cm-flex-center cm-width100' direction='vertical' size={15}>
                <Space style={{height: "100px"}} className='cm-flex-center'>
                    <div style={{background: "#f2f1f3"}} className='j-settings-integration-icon-wrap'><img style={{width: "55px"}} src={BUYERSTAGE_PRODUCT_LOGO}/></div>
                    <div style={{background: "#f2f1f3", marginLeft: "-25px"}} className='j-settings-integration-icon-wrap'><img style={{width: "60px"}} src={crmType === SALESFORCE ? SALESFORCE_LOGO : HUBSPOT_LOGO_NEW}/></div>
                </Space>
                <div className='cm-font-fam500 cm-font-size20 cm-margin-bottom20'>
                    {crmType === SALESFORCE ? `Salesforce` : `HubSpot`} Settings
                </div>
            </Space>  
            {
                crmType === SALESFORCE 
                ?
                    <SfdcSyncOptions crmType={SALESFORCE} settings={settings} onClose={onClose}/>
                :
                    null
            }
        </> 
    )
}

export default CRMSyncOptions
import { Space, Tabs } from "antd";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded"
import VendorShareLink from "./vendor-share-link";
import VendorShareWebhook from "./vendor-share-webhook";
import VendorShareScript from "./vendor-share-script";
import VendorShareQRCode from "./vendor-share-qr-code";

const { TabPane }   =   Tabs;

const VendorShareForm = (props: {onClose: any, sharableLink: string, isGated: boolean, templateId: any}) => {

    const { onClose, sharableLink, isGated, templateId }   =   props;
    
    return(
        <div className='cm-height100'>
            <div className='j-vendor-share-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Share
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={onClose}/>
                </Space>
            </div>
            <div className="j-vendor-share-form-body">
                <Tabs className="j-vendor-share-tab">
                    <TabPane className='cm-font-fam500' tab={<Space><MaterialSymbolsRounded font="link"/>Link</Space>} key='link'>                                                            
                        <VendorShareLink sharableLink={sharableLink} isGated={isGated}/>                                                      
                    </TabPane>
                    <TabPane className='cm-font-fam500' tab={<Space><MaterialSymbolsRounded font="qr_code"/>QR Code</Space>} key='qrcode'>                                                            
                        <VendorShareQRCode sharableLink={sharableLink}/>                         
                    </TabPane>
                    <TabPane className='cm-font-fam500' tab={<Space><MaterialSymbolsRounded font="webhook"/>Webhook</Space>} key="webhook">
                        <VendorShareWebhook templateId={templateId}/>
                    </TabPane>
                    <TabPane className='cm-font-fam500'tab={<Space><MaterialSymbolsRounded font="code"/>Script</Space>} key="script">
                        <VendorShareScript templateId={templateId}/>
                    </TabPane>
                </Tabs>
            </div>

        </div>
    )
}

export default VendorShareForm
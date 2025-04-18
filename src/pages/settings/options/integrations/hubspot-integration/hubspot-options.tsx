import { Checkbox, Form, Space, Tooltip } from "antd";
import { HS_SYNC_OPTION_CONFIG, RESOURCE_ADDED_BY_BUYER, RESOURCE_ADDED_BY_SELLER } from "../../../config/hs-sync-options";
import { SettingsAgent } from "../../../api/settings-agent";
import { CommonUtil } from "../../../../../utils/common-util";
import { ERROR_CONFIG } from "../../../../../config/error-config";
import { HUBSPOT } from "../../../config/integration-type-config";

const { useForm }   =   Form;

const HsSyncOptions = (props: {settings: any}) => {

    const { settings }  =   props;

    const [form ]       =   useForm()

    let crmSettingsJson = settings ? { ...settings } : null;

    const onChange = (stage: boolean, key: any) => {

        crmSettingsJson[key] = stage
        
        SettingsAgent.updateIntegrationSettings({
            variables: {
                type  :  HUBSPOT,
                input :  crmSettingsJson
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    }

    const initialSelectedOptions = settings ? Object.keys(settings).filter(
        (key) => settings[key] === true
    ) : null;

    if(initialSelectedOptions){
        return(
            <div className="cm-padding-inline20 cm-padding-block10">
                <Form className="cm-form" form={form} layout="vertical">
                    <Space direction='vertical' size={10} style={{width: "100%"}}>
                        <Form.Item name="syncOptions" initialValue={initialSelectedOptions} label={<div className="cm-font-size16 cm-font-fam600  cm-padding-bottom15">Sync Configuration (Deal)</div>}>
                            <Checkbox.Group >
                                <Space direction='vertical'>
                                    {
                                        Object.values(HS_SYNC_OPTION_CONFIG).map((_option) => (
                                            _option.key !== RESOURCE_ADDED_BY_SELLER && _option.key !== RESOURCE_ADDED_BY_BUYER &&
                                                <Checkbox onChange={(event) => onChange(event.target.checked, event.target.value)} className='cm-flex-align-center cm-font-opacity-black-85' key={_option.formKey} value={_option.formKey}>
                                                    <Tooltip title={_option.tooltip ? _option.tooltip : ""}>
                                                        <div className='cm-margin-left5 cm-flex-center'>
                                                            {_option.displayName}
                                                        </div>
                                                    </Tooltip>
                                                </Checkbox>
                                        ))
                                    }
                                    <div className="cm-font-fam500 cm-margin-top10">Action point's documents sync</div>
                                    <Checkbox onChange={(event) => onChange(event.target.checked, event.target.value)} className='cm-margin-left15 cm-flex-align-center' key={HS_SYNC_OPTION_CONFIG[RESOURCE_ADDED_BY_SELLER].formKey} value={HS_SYNC_OPTION_CONFIG[RESOURCE_ADDED_BY_SELLER].formKey}>
                                        <div className='cm-margin-left5 cm-flex-center cm-font-opacity-black-85'>
                                            All documents uploaded by the <span className="cm-font-fam500" style={{color: "#000"}}>&nbsp;Seller&nbsp;</span> will be pushed to HubSpot
                                        </div>
                                    </Checkbox>
                                    <Checkbox onChange={(event) => onChange(event.target.checked, event.target.value)} className='cm-margin-left15 cm-flex-align-center' key={HS_SYNC_OPTION_CONFIG[RESOURCE_ADDED_BY_BUYER].formKey} value={HS_SYNC_OPTION_CONFIG[RESOURCE_ADDED_BY_BUYER].formKey}>
                                        <div className='cm-margin-left5 cm-flex-center cm-font-opacity-black-85'>
                                            All documents uploaded by the <span className="cm-font-fam500" style={{color: "#000"}}>&nbsp;Buyer&nbsp;</span> will be pushed to HubSpot
                                        </div>
                                    </Checkbox>
                                </Space>
                            </Checkbox.Group>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        )   
    }else{
        return <></>
    }
}

export default HsSyncOptions
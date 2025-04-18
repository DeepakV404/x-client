import { useContext, useState } from "react";
import { Space, Button, Form } from "antd";

import { CRM_INTEGRATION_CONFIG } from "../../settings/config/integration-type-config";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";
import { useParams } from "react-router-dom";

import CRMSearch from "../create-room/crm-search";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;

const CRMMapDeal = (props: {onClose: () => void}) => {

    const { onClose }  =   props;

    const params       =   useParams();

    const { $orgDetail }     =     useContext(GlobalContext);

    const [form]    =   useForm();

    const [hasValue, setHasValue ]              =   useState(false);
    const [submitState, setSubmitState]         =   useState({
        text    : "Map",
        loading : false
    });

    const onFinish = (values: any) => {

        setSubmitState({
            loading: true,
            text: "Mapping.."
        })

        RoomsAgent.updateRoom({
            variables: {
                roomUuid        :   params.roomId,
                input           :   {
                    crmInfoInput    :   {
                        type  :   "deal",
                        id    :   values.crmEntity.key,
                        name  :   values.crmEntity.title
                    }
                }
            },
            onCompletion: () => {
                setSubmitState({
                    loading: false,
                    text: "Map"
                })
                CommonUtil.__showSuccess("Room mapped with CRM successfully")
                onClose()
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    loading: false,
                    text: "Map"
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleValuesChange = (selectedDeal: any) => {
        if(selectedDeal?.crmEntity){
            setHasValue(true)
        }else{
            setHasValue(false)
        }
    }

    return(
        <div className="cm-width100">
            <div className="cm-modal-header cm-font-fam500 cm-flex-align-center">
                Map Room with {CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.displayName} Deal
            </div>
            <div className="cm-modal-content">
                <Form 
                    form            =   {form} 
                    onFinish        =   {onFinish} 
                    layout          =   "vertical"
                    className       =   "cm-form"
                    onValuesChange  =   {handleValuesChange}
                >
                    <CRMSearch/>    
                </Form> 
            </div>
            <div className="cm-modal-footer">
                <Space className='cm-width100 cm-margin-top15 cm-flex-justify-end'>
                    <Button onClick={onClose}>Cancel</Button>                      
                    <Button type="primary" onClick={() => form.submit()} disabled={!hasValue} className={!hasValue ? "cm-button-disabled" : ""}>
                        <Space size={10}>
                            {submitState.text}
                            {
                                submitState.loading && <Loading color="#fff" size='small'/>
                            }
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default CRMMapDeal
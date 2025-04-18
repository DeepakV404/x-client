import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Space, Tooltip, Typography } from "antd";

import { FROM_SCRATCH, ONE_PAGER, SALES_TEMPLATE, TEMPLATE_OPTION_CONFIG } from "../config/template-option-config";
import { MODULE_TEMPLATE } from "../../../constants/module-constants";
import { RoomTemplateAgent } from "../api/room-template-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { RoomsAgent } from "../../rooms/api/rooms-agent";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const { Text }    =   Typography;

export const getTemplateOptionIcon = (key: string, isAlreadyAdded: boolean) => {
    
    if(isAlreadyAdded) return <MaterialSymbolsRounded font="check" color="#389e0d" size="25"/>;
        
    switch (key) {
        case FROM_SCRATCH:
            return <MaterialSymbolsRounded font="draft" size="22"/>;
        case ONE_PAGER:
            return <MaterialSymbolsRounded font="featured_play_list" size="22"/>;
        case SALES_TEMPLATE:
            return <MaterialSymbolsRounded font="segment" size="22"/>
        default:
            return <div style={{fontSize: "20px"}}>{TEMPLATE_OPTION_CONFIG[key]?.emoji}</div>
    }
};

const FromScratchOptions = (props: {module: string}) => {

    const { module }    =   props;

    const params      =     useParams();

    const { $isVendorMode, $isVendorOrg }    =   useContext(GlobalContext);

    const handleSelectedTemplateOption = (option: any) => { 
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.initializeTemplate({
                variables : {
                    templateUuid   :  params.roomTemplateId,
                    sectionConfig  :  option
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{
            RoomsAgent.initializeRoom({
                variables : {
                    roomUuid       :  params.roomId,
                    sectionConfig  :  option
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        } 
        
    }

    return (
        <>
            <div className="cm-height100 cm-flex-center cm-background-gray cm-overflow-auto">
                <Space direction="vertical" className="cm-height100 cm-flex-align-center" style={{paddingBlock: "40px"}}>
                    <div className="cm-font-size28 cm-font-fam500 cm-padding-bottom10">How would you like to start?</div>
                    <div className="j-rt-template-options cm-padding20" style={{marginBottom: "40px"}}>
                        {
                            Object.values(TEMPLATE_OPTION_CONFIG).map((_option: any) => (
                                ($isVendorMode || $isVendorOrg) ? 
                                    (_option.key !== "NEXT_STEPS" && _option.key !== "SALES_TEMPLATE") &&
                                        <Tooltip 
                                            key         =   {`${_option.key}_tooltip`}
                                            placement   =   "right"
                                            color       =   "#fff"
                                            overlayClassName   =   "j-template-options-tooltip"
                                            overlayInnerStyle  =   {{
                                                width         : '280px',      
                                                borderRadius  : '15px',
                                                padding       : "15px 0px 0px 15px", 
                                            }}
                                            title       =   {
                                                <Space direction="vertical" size={2}>
                                                    <div className="cm-dark-text cm-font-fam500">{_option.title}</div>
                                                    <div className="cm-font-size12 cm-secondary-text" style={{paddingInlineEnd: "5px"}}>{_option.tooltip}</div>
                                                    <img className="cm-padding-top10 cm-float-right" src={_option.image}/>
                                                </Space>
                                            }
                                        >
                                            <div key={_option.key} className="j-rt-initialize-template-option cm-padding10 cm-cursor-pointer" onClick={() => handleSelectedTemplateOption(_option.key)}>
                                                <Space size={14}>
                                                    {getTemplateOptionIcon(_option.key, false)}
                                                    <Space direction="vertical" size={4}>
                                                        <div className="cm-font-fam500">{_option.title}</div>
                                                        <Text style={{maxWidth: "450px"}} ellipsis={{tooltip: ""}} className="cm-font-size13 cm-secondary-text">{_option.description}</Text>
                                                    </Space>
                                                </Space>
                                            </div>
                                        </Tooltip>
                                :
                                    <Tooltip 
                                        key         =   {`${_option.key}_tooltip`}
                                        placement   =   "right"
                                        color       =   "#fff"
                                        overlayClassName   =   "j-template-options-tooltip"
                                        overlayInnerStyle  =   {{
                                            width         : '280px',      
                                            borderRadius  : '15px',
                                            padding       : "15px 0px 0px 15px", 
                                        }}
                                        title       =   {
                                            <Space direction="vertical" size={2}>
                                                <div className="cm-dark-text cm-font-fam500">{_option.title}</div>
                                                <div className="cm-font-size12 cm-secondary-text" style={{paddingInlineEnd: "5px"}}>{_option.tooltip}</div>
                                                <img className="cm-padding-top10 cm-float-right" src={_option.image}/>
                                            </Space>
                                        }
                                    >
                                        <div key={_option.key} className="j-rt-initialize-template-option cm-padding10 cm-cursor-pointer" onClick={() => handleSelectedTemplateOption(_option.key)}>
                                            <Space size={14}>
                                                {getTemplateOptionIcon(_option.key, false)}
                                                <Space direction="vertical" size={4}>
                                                    <div className="cm-font-fam500">{_option.title}</div>
                                                    <Text style={{maxWidth: "450px"}} ellipsis={{tooltip: ""}} className="cm-font-size13 cm-secondary-text">{_option.description}</Text>
                                                </Space>
                                            </Space>
                                        </div>
                                    </Tooltip>

                            ))
                        }
                    </div>
                </Space>
            </div>
        </>
    )
}

export default FromScratchOptions

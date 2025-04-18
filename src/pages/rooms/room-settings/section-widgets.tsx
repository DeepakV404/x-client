import { capitalize } from 'lodash';
import { Button, message, Space, Typography } from "antd";
import { useQuery } from "@apollo/client";

import { WidgetsAgent } from '../../custom-sections/api/widgets-agent';
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { R_WIDGET_CATALOG } from "../api/rooms-query";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { Text }  =   Typography

const SectionWidgets = (props: {tourRef?: any, setWidgetSlider: any, sectionId?: string, setNewWidgetId?: any}) => {

    const { setWidgetSlider, sectionId, setNewWidgetId }   =   props

    const { data, loading,  error }  =   useQuery(R_WIDGET_CATALOG);

    const handleWidgetCreation = (widgetUuid: string) => {
        const messageLoading = message.loading("Adding your widget...", 0)
        WidgetsAgent.cloneWidget({
            variables: {
                sectionUuid: sectionId,
                widgetUuid: widgetUuid,
                input: {
                    isHidden: false
                }
            },
            onCompletion: (data: any) => {
                setNewWidgetId && setNewWidgetId(data.cloneWidget.uuid)
                messageLoading()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }
    
    if(loading) return <Loading />
    if(error) return <SomethingWentWrong/>
    
    return (
        <div className="cm-height100" style={{borderRight: "1px solid #E8E8EC"}}>
            <Space className='cm-padding15 cm-width100' style={{height: "50px"}}>
                <MaterialSymbolsRounded className='cm-cursor-pointer' font='keyboard_double_arrow_right' onClick={() => setWidgetSlider((prev: boolean) => !prev)}/>
                <Text>Widgets</Text>
            </Space>
            <div style={{height: "calc(100% - 50px)", paddingBottom: "20px"}} className="cm-overflow-auto">
                <Space direction='vertical' className='cm-flex-center'>
                    {
                        data.widgetCatalog.map((widget: any) => (
                            widget.name !== "RESOURCE GRID" ?
                                <div className='cm-flex-center cm-border-radius6'>
                                    <Space direction='vertical' size={12}>
                                        <div className='j-section-widget-box cm-aspect-ratio16-9 cm-position-relative hover-item cm-flex-center'>
                                            <img width={"100%"} src={widget.thumbnailUrl} alt={widget.name} />
                                            <Text className='j-widget-name cm-width100 cm-flex-center cm-font-size12 cm-position-absolute' style={{bottom: "10px"}}>{capitalize(widget.name)}</Text>
                                            <div className='show-on-hover-icon'>
                                                <Button size='small' className='j-add-widget-btn cm-padding-inline20 cm-cursor-pointer cm-font-size10 cm-position-absolute' onClick={() => handleWidgetCreation(widget.uuid)} style={{bottom: "7px", left: "30%", lineHeight: "23px"}}>Add</Button>
                                            </div>
                                        </div>
                                    </Space>
                                </div>
                            :
                                null
                        ))
                    }
                </Space>
            </div>
        </div>
    )
}

export default SectionWidgets
import { capitalize } from 'lodash';
import { useQuery } from "@apollo/client";
import { Button, Col, Row, Space, Typography, message } from "antd";

import { WidgetsAgent } from '../../../../custom-sections/api/widgets-agent';
import { ERROR_CONFIG } from '../../../../../config/error-config';
import { CommonUtil } from '../../../../../utils/common-util';
import { R_WIDGET_CATALOG } from "../../../api/rooms-query";

import SomethingWentWrong from '../../../../../components/error-pages/something-went-wrong';
import Loading from '../../../../../utils/loading';

const { Text }  =    Typography;

const WidgetCard = (props: {sectionId: string, onClose: () => void, currentOrder: number, setNewWidgetId?: any}) => {

    const { sectionId, onClose, currentOrder, setNewWidgetId }     =   props;

    const { data, loading,  error }  =   useQuery(R_WIDGET_CATALOG);

    const handleWidgetCreation = (widgetUuid: string) => {
        const messageLoading = message.loading("Adding your widget...", 0)
        WidgetsAgent.cloneWidget({
            variables: {
                sectionUuid: sectionId,
                widgetUuid: widgetUuid,
                input: {
                    order: currentOrder + 1,
                    isHidden: false
                }
            },
            onCompletion: (data: any) => {
                setNewWidgetId(data.cloneWidget.uuid)
                messageLoading();
                onClose()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }
    
    if(loading) return <Loading />
    if(error) return <SomethingWentWrong/>

    return(
        <div>
            <div className="cm-font-size16 cm-font-fam500 cm-margin-bottom20">Add a widget</div>
            {
                data.widgetCatalog.length > 0 ?
                    <Row gutter={[20,10]}>
                        {
                            data.widgetCatalog.map((widget: any) => (
                                widget.name !== "RESOURCE GRID" ?
                                    <Col span={8} key={widget.uuid}>
                                        <div className='cm-flex-center cm-border-radius6'>
                                            <Space direction='vertical' size={12}>
                                                <div className='j-section-widget-box cm-position-relative hover-item cm-flex-center'>
                                                    <img width={"100%"} src={widget.thumbnailUrl} alt="" loading="lazy"/>
                                                    <Text className='j-widget-name cm-width100 cm-flex-center cm-font-size12 cm-position-absolute' style={{bottom: "10px"}}>{capitalize(widget.name)}</Text>
                                                    <div className='show-on-hover-icon'>
                                                        <Button size='small' className='j-add-widget-btn cm-padding-inline20 cm-cursor-pointer cm-font-size10 cm-position-absolute' onClick={() => handleWidgetCreation(widget.uuid)} style={{bottom: "7px", left: "30%", lineHeight: "normal"}}>
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Space>
                                        </div>
                                    </Col>
                                :
                                    null
                            ))
                        }
                    </Row>
                :
                    <div className='cm-flex-center cm-light-text' style={{height: "300px"}}>No widgets found</div>
            }
        </div>
    )
}

export default WidgetCard